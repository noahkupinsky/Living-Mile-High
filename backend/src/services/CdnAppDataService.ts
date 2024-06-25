import { AppData, DeepPartial, DefaultAppData, House } from 'living-mile-high-lib';
import { CdnFixedKeys } from '../types/enums';
import { AppDataService, CdnAdapter, HouseService, OtherData, OtherService } from '../types';
import { AppDataValidator } from '../utils/AppDataValidator';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import axios, { AxiosError } from 'axios';

async function downloadImage(url: string): Promise<{ buffer: Buffer, contentType: string }> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        buffer: Buffer.from(response.data),
        contentType: response.headers['content-type']
    };
}

function composeAppData(houses: House[], other: OtherData) {
    return { ...other, houses: houses };
}

class CdnAppDataService implements AppDataService {
    private cdn: CdnAdapter;
    private houseService: HouseService;
    private otherService: OtherService;

    constructor(cdn: CdnAdapter, houseService: HouseService, otherService: OtherService) {
        this.cdn = cdn;
        this.houseService = houseService;
        this.otherService = otherService;
    }

    public async update(): Promise<AppData> {
        const objectKey = CdnFixedKeys.AppData;
        const houses = await this.houseService.getHouseObjects();
        const other = await this.otherService.getOtherObject();
        const appData = composeAppData(houses, other);

        if (!AppDataValidator.validate(appData)) {
            throw new Error('Invalid AppData');
        }

        await this.updateHomeFirst(appData.homeImages);

        const putObjectSuccess = await this.cdn.putObject(objectKey, JSON.stringify(appData), 'application/json');
        if (!putObjectSuccess) {
            throw new Error('Failed to update AppData in CDN');
        }

        return appData;
    }

    private async updateHomeFirst(homeImages: string[]): Promise<void> {
        try {
            const homeFirstKey = CdnFixedKeys.HomeFirst;
            const firstImageUrl = homeImages[0];

            const { buffer, contentType } = await downloadImage(firstImageUrl);

            await this.cdn.putObject(homeFirstKey, buffer, contentType);
        } catch (error: any) {
            if (!(error instanceof AxiosError)) {
                throw error;
            }
        }
    }
}

export default CdnAppDataService
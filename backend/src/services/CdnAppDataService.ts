import { SiteData, House } from 'living-mile-high-lib';
import { CdnFixedKeys } from '../types/enums';
import { AppDataService, CdnAdapter, HouseService, GeneralData, GeneralDataService } from '../types';
import { AppDataValidator } from '../utils/AppDataValidator';
import axios, { AxiosError } from 'axios';

async function downloadImage(url: string): Promise<{ buffer: Buffer, contentType: string }> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        buffer: Buffer.from(response.data),
        contentType: response.headers['content-type']
    };
}

function composeAppData(houses: House[], general: GeneralData) {
    return { ...general, houses: houses };
}

class CdnAppDataService implements AppDataService {
    private cdn: CdnAdapter;
    private houseService: HouseService;
    private generalDataService: GeneralDataService;

    constructor(cdn: CdnAdapter, houseService: HouseService, generalService: GeneralDataService) {
        this.cdn = cdn;
        this.houseService = houseService;
        this.generalDataService = generalService;
    }

    public async update(): Promise<SiteData> {
        const objectKey = CdnFixedKeys.AppData;
        const houses = await this.houseService.getHouseObjects();
        const generalData = await this.generalDataService.getGeneralData();
        const appData = composeAppData(houses, generalData);

        if (!AppDataValidator.validate(appData)) {
            throw new Error('Invalid AppData');
        }

        await this.updateHomeFirst(appData.homeImages);

        await this.cdn.putObject(objectKey, JSON.stringify(appData), 'application/json');

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
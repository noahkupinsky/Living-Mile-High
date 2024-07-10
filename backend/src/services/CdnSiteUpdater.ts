import { CdnKeys } from "living-mile-high-lib";
import { CdnAdapter, SiteUpdater, StateService } from "../types/services";
import { AppDataValidator } from "../utils/AppDataValidator";
import axios, { AxiosError } from "axios";

async function downloadImage(url: string): Promise<{ buffer: Buffer, contentType: string }> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        buffer: Buffer.from(response.data),
        contentType: response.headers['content-type']
    };
}

class CdnSiteUpdater implements SiteUpdater {
    private stateService: StateService;
    private cdn: CdnAdapter;

    constructor(stateService: StateService, cdn: CdnAdapter) {
        this.stateService = stateService;
        this.cdn = cdn;
    }

    async updateSiteData(): Promise<void> {
        const siteData = await this.stateService.getState();

        if (!AppDataValidator.validate(siteData)) {
            throw new Error('Invalid AppData');
        }

        await this.updateHomeFirst(siteData.homeImages);

        await this.cdn.putObject(CdnKeys.siteData, JSON.stringify(siteData), 'application/json');
    }

    private async updateHomeFirst(homeImages: string[]): Promise<void> {
        try {
            const firstImageUrl = homeImages[0];

            const { buffer, contentType } = await downloadImage(firstImageUrl);

            await this.cdn.putObject(CdnKeys.homeFirst, buffer, contentType);
        } catch (error: any) {
            if (!(error instanceof AxiosError)) {
                throw error;
            }
        }
    }

    async deleteBackup(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async restoreBackup(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async listBackups(): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    async createBackup(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}


export default CdnSiteUpdater
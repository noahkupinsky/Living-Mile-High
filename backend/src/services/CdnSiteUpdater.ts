import axios, { AxiosError } from "axios";

import { CdnKeys } from "living-mile-high-lib";
import { CdnAdapter, SiteUpdater, StateService } from "~/@types";
import { ContentType } from "~/@types/constants";
import { AppDataValidator } from "~/utils/AppDataValidator";

export async function downloadImage(url: string): Promise<{ buffer: Buffer, contentType: ContentType }> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        buffer: Buffer.from(response.data),
        contentType: response.headers['content-type']
    };
}

export class CdnSiteUpdater implements SiteUpdater {
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

        await this.updateHomePageFirst(siteData.homePageImages);

        await this.cdn.putObject(CdnKeys.SITE_DATA, JSON.stringify(siteData), ContentType.JSON);
    }

    private async updateHomePageFirst(homePageImages: string[]): Promise<void> {
        try {
            const firstImageUrl = homePageImages[0];

            const { buffer, contentType } = await downloadImage(firstImageUrl);

            await this.cdn.putObject(CdnKeys.HOME_PAGE_FIRST, buffer, contentType);
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
import { AxiosError } from "axios";
import { CdnKeys } from "living-mile-high-lib";
import { ContentType } from "~/@types/constants";
import { AppDataValidator } from "~/utils/AppDataValidator";
import { services } from "~/di";
import { downloadImage } from "~/utils/misc";

export async function updateSiteData(): Promise<void> {
    const { stateService, cdnAdapter, backupService } = services();

    const siteData = await stateService.getState();

    if (!AppDataValidator.validate(siteData)) {
        throw new Error('Invalid AppData');
    }

    await updateHomePageFirst(siteData.homePageImages);

    await cdnAdapter.putObject({
        key: CdnKeys.SITE_DATA,
        body: JSON.stringify(siteData),
        contentType: ContentType.JSON
    });

    await backupService.createAutoBackup();
}

async function updateHomePageFirst(homePageImages: string[]): Promise<void> {
    const { cdnAdapter } = services();

    try {
        const firstImageUrl = homePageImages[0];

        const { buffer, contentType } = await downloadImage(firstImageUrl);

        await cdnAdapter.putObject({
            key: CdnKeys.HOME_PAGE_FIRST,
            body: buffer,
            contentType: contentType
        });
    } catch (error: any) {
        if (!(error instanceof AxiosError)) {
            throw error;
        }
    }
}
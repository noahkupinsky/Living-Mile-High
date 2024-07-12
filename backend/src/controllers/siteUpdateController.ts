import { AxiosError } from "axios";
import { CdnKeys } from "living-mile-high-lib";
import { ContentCategory, ContentType } from "~/@types/constants";
import { AppDataValidator } from "~/utils/AppDataValidator";
import { services } from "~/di";
import { downloadImage, streamToParsedJson } from "~/utils/misc";

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

export async function pruneAssets(): Promise<void> {
    const { stateService, cdnAdapter, backupService } = services();

    await backupService.pruneBackups();

    const backups = await backupService.getBackups();

    const state = await stateService.getState();

    const referencedAssets = new Set<string>();

    // Extract keys from state data
    const stateKeys = cdnAdapter.extractKeys(state);
    stateKeys.forEach(key => referencedAssets.add(key));

    // Extract keys from valid backups
    for (const backup of backups) {
        const data = await streamToParsedJson(backup.body);

        const backupKeys = cdnAdapter.extractKeys(data);
        backupKeys.forEach(key => referencedAssets.add(key));
    }

    const allAssets = await cdnAdapter.getKeys(ContentCategory.ASSET);
    const assetsToDelete = allAssets.filter(asset => !referencedAssets.has(asset));

    cdnAdapter.deleteObjects(assetsToDelete);
}
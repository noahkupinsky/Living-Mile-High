import { CdnFixedKey } from "living-mile-high-lib";
import { ContentCategory, ContentType } from "~/@types/constants";
import { services } from "~/di";
import { SiteDataValidator } from "~/utils/SiteDataValidator";
import { downloadImage, streamToParsedJson } from "~/utils/misc";

const cdn = () => services().cdnAdapter;
const backupService = () => services().backupService;
const assetService = () => services().assetService;
const getState = async () => services().stateService.getState();

// INTERMEDIATES, NOT ROUTES

export async function updateFixedKeys() {
    await updateSiteData();
    await updateHomePageFirst();
}

export async function updateSiteData(): Promise<void> {
    const siteData = await getState();

    SiteDataValidator.validate(siteData);

    const stringifiedSiteData = JSON.stringify(siteData);

    await cdn().putObject({
        key: CdnFixedKey.SITE_DATA,
        body: stringifiedSiteData,
        contentType: ContentType.JSON
    });
}

export async function updateHomePageFirst(): Promise<void> {
    const siteData = await getState();

    SiteDataValidator.validate(siteData);

    const homePageFirst = siteData.homePageImages[0];

    const { buffer, contentType } = await downloadImage(homePageFirst);

    await cdn().putObject({
        key: CdnFixedKey.HOME_PAGE_FIRST,
        body: buffer,
        contentType: contentType
    });
}

export async function pruneAssets(): Promise<void> {
    const backups = await backupService().getBackups();

    const state = await getState();

    const referencedAssets = new Set<string>();

    // Extract keys from state data
    const stateKeys = cdn().extractKeys(state);
    stateKeys.forEach(key => referencedAssets.add(key));

    // Extract keys from valid backups
    for (const backup of backups) {
        const data = await streamToParsedJson(backup.body);

        const backupKeys = cdn().extractKeys(data);
        backupKeys.forEach(key => referencedAssets.add(key));
    }

    const allAssets = await cdn().getKeys(ContentCategory.ASSET);
    const unreferencedAssets = allAssets.filter(asset => !referencedAssets.has(asset));
    const expiredUnreferencedAssets = await assetService().getExpiredAssets(unreferencedAssets);
    cdn().deleteObjects(expiredUnreferencedAssets);
}
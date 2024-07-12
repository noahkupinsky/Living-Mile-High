import { CdnKeys, DefaultGeneralData, DefaultHomePageImages, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { BackupService, CdnAdapter, GeneralDataService } from "~/@types";
import { combineSiteData, downloadImage, prefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { pruneAssets, updateSiteData } from "~/controllers/siteUpdateController";
import { ContentPrefix, ContentType } from "~/@types/constants";

let backupService: BackupService;
let generalDataService: GeneralDataService;
let cdn: CdnAdapter;

beforeAll(() => {
    ({ generalDataService, backupService, cdnAdapter: cdn } = services());
});

describe('SiteUpdater', () => {
    test('updateSiteData should update site data', async () => {
        await updateSiteData();

        const expectedSiteData = combineSiteData(DefaultGeneralData, []);
        const siteDataString = inMemoryCdn[CdnKeys.SITE_DATA].body;

        const siteData = JSON.parse(siteDataString) as SiteData;

        expect(siteData).toEqual(expectedSiteData);
    });

    test('updateSiteData should update home first', async () => {
        await updateSiteData();

        const expectedHomePageFirst = (await downloadImage(DefaultHomePageImages[0])).buffer;
        const homePageFirst = inMemoryCdn[CdnKeys.HOME_PAGE_FIRST].body;

        expect(homePageFirst).toEqual(expectedHomePageFirst);
    });

    test('updateSiteData should produce an automatic backup', async () => {
        await updateSiteData();

        const backups = await backupService.getBackupIndices();

        expect(backups).toHaveLength(1);
    });
});

describe('PruneAssets', () => {
    test('pruneAssets should delete assets that were never referred to', async () => {
        await updateSiteData();

        const assetKey = await cdn.putObject({
            key: 'test-key',
            body: 'body',
            contentType: ContentType.TEXT,
            prefix: ContentPrefix.ASSET
        });

        await pruneAssets();

        expect(inMemoryCdn[assetKey]).toBeUndefined();
    });

    test('pruneAssets should not delete assets referred to in nonexpired backups', async () => {
        // create asset
        const assetKey = await cdn.putObject({
            key: 'test-key',
            body: 'body',
            contentType: ContentType.TEXT,
            prefix: ContentPrefix.ASSET
        });
        const assetUrl = cdn.getObjectUrl(assetKey);

        // add asset to site data
        await generalDataService.update({
            about: {
                text: assetUrl
            }
        });
        // this will create an auto backup containing a reference to the asset url
        await updateSiteData();

        // remove asset from current site data
        await generalDataService.update({
            about: {
                text: 'about'
            }
        });

        // prune and expect the asset to still be there due to backup reference
        await pruneAssets();
        expect(inMemoryCdn[assetKey]).toBeDefined();
    });

    test('pruneAssets should delete assets referred to exclusively in expired backups', async () => {
        // create asset
        const assetKey = await cdn.putObject({
            key: 'test-key',
            body: 'body',
            contentType: ContentType.TEXT,
            prefix: ContentPrefix.ASSET
        });
        const assetUrl = cdn.getObjectUrl(assetKey);

        // add asset to site data
        await generalDataService.update({
            about: {
                text: assetUrl
            }
        });
        // this will create an auto backup containing a reference to the asset url
        await updateSiteData();

        // manually edit the date of the backup to expire it
        const backupKey = (await backupService.getBackupKeys())[0];

        inMemoryCdn[backupKey].metadata.expiration = new Date(Date.now() - 1000).toISOString();

        // remove asset from current site data
        await generalDataService.update({
            about: {
                text: 'about'
            }
        });

        // prune and expect the asset to still be there due to backup reference
        await pruneAssets();
        expect(inMemoryCdn[assetKey]).toBeUndefined();
    });
});

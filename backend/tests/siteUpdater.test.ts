import { CdnKeys, DefaultGeneralData, DefaultHomePageImages, House, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { BackupService, CdnAdapter, GeneralDataService, HouseService } from "~/@types";
import { combineSiteData, downloadImage, prefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { pruneAssets, updateSiteData } from "~/controllers/siteUpdateController";
import { ContentCategory, ContentType } from "~/@types/constants";

let backupService: BackupService;
let generalDataService: GeneralDataService;
let houseService: HouseService;
let cdn: CdnAdapter;

beforeAll(() => {
    ({ houseService, generalDataService, backupService, cdnAdapter: cdn } = services());
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
            prefix: ContentCategory.ASSET
        });

        await pruneAssets();

        expect(inMemoryCdn[assetKey]).toBeUndefined();
    });

    test('pruneAssets should leave non ASSET-prefixed content alone', async () => {
        await updateSiteData();

        const assetKey = await cdn.putObject({
            key: 'test-key',
            body: 'body',
            contentType: ContentType.TEXT,
        });

        await pruneAssets();

        expect(inMemoryCdn[assetKey]).toBeDefined();
    });

    test('pruneAssets should not delete assets referred to in nonexpired backups', async () => {
        // create asset
        const assetKey = await cdn.putObject({
            key: 'test-key',
            body: 'body',
            contentType: ContentType.TEXT,
            prefix: ContentCategory.ASSET
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
            prefix: ContentCategory.ASSET
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

        // manually expire the backup
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

    test('pruneAssets handle links within house objects', async () => {
        // create asset
        const assetKey1 = await cdn.putObject({
            key: 'test-key1',
            body: 'body',
            contentType: ContentType.TEXT,
            prefix: ContentCategory.ASSET
        });
        const assetUrl1 = cdn.getObjectUrl(assetKey1);
        const assetKey2 = await cdn.putObject({
            key: 'test-key2',
            body: 'body',
            contentType: ContentType.TEXT,
            prefix: ContentCategory.ASSET
        });
        const assetUrl2 = cdn.getObjectUrl(assetKey2);

        // add house containing links to both
        const mockHouse: House = {
            isDeveloped: true,
            isForSale: true,
            isSelectedWork: false,
            address: '123 Main St',
            mainImage: assetUrl1,
            images: [assetUrl2, 'image2.jpg'],
            neighborhood: 'Downtown',
            stats: {
                houseSquareFeet: 2000,
                lotSquareFeet: 3000,
                bedrooms: 3,
                bathrooms: 2,
                garageSpaces: 2
            }
        };
        await houseService.upsertHouse(mockHouse);

        // this will create an auto backup containing a reference to the asset url
        await updateSiteData();

        // manually expire the backup
        const backupKey = (await backupService.getBackupKeys())[0];
        inMemoryCdn[backupKey].metadata.expiration = new Date(Date.now() - 1000).toISOString();

        // remove JUST asset 1 from the house data
        const houseObjects = await houseService.getHouseObjects();
        const existingHouseId = houseObjects[0].id;
        await houseService.upsertHouse({
            id: existingHouseId,
            mainImage: 'image3.jpg'
        })

        await pruneAssets();
        expect(inMemoryCdn[assetKey1]).toBeUndefined();
        expect(inMemoryCdn[assetKey2]).toBeDefined();
    });
});

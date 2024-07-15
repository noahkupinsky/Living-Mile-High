import { CdnFixedKey, DefaultGeneralData, DefaultHomePageImages, House, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { BackupService, CdnAdapter, GeneralDataService, HouseService } from "~/@types";
import { combineSiteData, downloadImage } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { ContentCategory, ContentType } from "~/@types/constants";
import { pruneAssets, pruneCdn, updateFixedKeys, updateHomePageFirst, updateSiteData } from "~/controllers/cdnController";

let backupService: BackupService;
let generalDataService: GeneralDataService;
let houseService: HouseService;
let cdn: CdnAdapter;

beforeAll(() => {
    ({ houseService, generalDataService, backupService, cdnAdapter: cdn } = services());
});

describe('update fixed keys', () => {
    test('updateSiteData should update site data', async () => {
        await updateSiteData();

        const expectedSiteData = combineSiteData(DefaultGeneralData, []);
        const siteDataString = inMemoryCdn[CdnFixedKey.SITE_DATA].body;

        const siteData = JSON.parse(siteDataString) as SiteData;

        expect(siteData).toEqual(expectedSiteData);
    });

    test('updateHomePageFirst should update home first', async () => {
        await updateHomePageFirst();

        const expectedHomePageFirst = (await downloadImage(DefaultHomePageImages[0])).buffer;
        const homePageFirst = inMemoryCdn[CdnFixedKey.HOME_PAGE_FIRST].body;

        expect(homePageFirst).toEqual(expectedHomePageFirst);
    });

    test('updateFixedKeys should do both', async () => {
        await updateFixedKeys();

        const expectedSiteData = combineSiteData(DefaultGeneralData, []);
        const siteDataString = inMemoryCdn[CdnFixedKey.SITE_DATA].body;

        const siteData = JSON.parse(siteDataString) as SiteData;

        expect(siteData).toEqual(expectedSiteData);

        const expectedHomePageFirst = (await downloadImage(DefaultHomePageImages[0])).buffer;
        const homePageFirst = inMemoryCdn[CdnFixedKey.HOME_PAGE_FIRST].body;

        expect(homePageFirst).toEqual(expectedHomePageFirst);
    });
});

describe('pruning the cdn', () => {
    test('pruneAssets should delete assets that were never referred to', async () => {
        await updateFixedKeys();

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

    test('pruneAssets should not delete assets referred to in backups', async () => {
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
        // update site data and create auto backup
        await updateSiteData();
        await backupService.createAutoBackup();

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

        // update site data and create auto backup
        await updateSiteData();

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

    test('pruneCdn should prune backups and then prune assets', async () => {
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
        // update site data and create auto backup
        await updateSiteData();
        await backupService.createAutoBackup();

        //manually expire the backup
        const backupKey = (await backupService.getBackupKeys())[0];
        inMemoryCdn[backupKey].metadata.expiration = new Date(Date.now() - 1000).toISOString();

        // remove asset from current site data
        await generalDataService.update({
            about: {
                text: 'about'
            }
        });

        // prune and expect the asset to still be there due to backup reference
        await pruneCdn();
        expect(inMemoryCdn[assetKey]).toBeUndefined();
    });
});

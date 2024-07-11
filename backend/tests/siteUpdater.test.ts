import { CdnKeys, DefaultGeneralData, DefaultHomePageImages, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { CdnAdapter, GeneralDataService, HouseService, SiteUpdater } from "~/@types";
import { combineSiteData, prefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { downloadImage } from "~/services/CdnSiteUpdater";
import { BackupType, ContentPrefix, ContentType } from "~/@types/constants";

let cdn: CdnAdapter;
let siteUpdater: SiteUpdater;
let houseService: HouseService;
let generalDataService: GeneralDataService;

beforeAll(() => {
    cdn = services().cdnAdapter;
    siteUpdater = services().siteUpdater;
    houseService = services().houseService;
    generalDataService = services().generalDataService;
});

describe('SiteUpdater', () => {
    test('updateSiteData should update site data', async () => {
        await siteUpdater.updateSiteData();

        const expectedSiteData = combineSiteData(DefaultGeneralData, []);
        const siteDataString = inMemoryCdn[CdnKeys.SITE_DATA].body;

        const siteData = JSON.parse(siteDataString) as SiteData;

        expect(siteData).toEqual(expectedSiteData);
    });

    test('updateSiteData should update home first', async () => {
        await siteUpdater.updateSiteData();

        const expectedHomePageFirst = (await downloadImage(DefaultHomePageImages[0])).buffer;
        const homePageFirst = inMemoryCdn[CdnKeys.HOME_PAGE_FIRST].body;

        expect(homePageFirst).toEqual(expectedHomePageFirst);
    });

    test('updateSiteData should produce an automatic backup', async () => {
        await siteUpdater.updateSiteData();

        const backups = await siteUpdater.listBackups();

        expect(backups).toHaveLength(1);
    });

    test('listBackups should list backups', async () => {
        const name = "Hello World";

        const key = 'backup-key';
        const prefixedKey = prefixKey(key, ContentPrefix.BACKUP);

        cdn.putObject({
            key: key,
            body: 'body',
            contentType: ContentType.JSON,
            prefix: ContentPrefix.BACKUP,
            metadata: {
                name: name
            }
        });

        const backups = await siteUpdater.listBackups();

        expect(backups).toEqual([{
            name: name,
            key: prefixedKey
        }]);
    });

    test('createManualBackup should create a manual backup', async () => {
        const backupName = 'manual-backup';

        await siteUpdater.createManualBackup(backupName);

        const backups = await siteUpdater.listBackups();

        expect(backups).toHaveLength(1);
        expect(backups[0].name).toBe(backupName);
    });

    test('deleteManualBackup should delete manual backup', async () => {
        const backupKey = prefixKey('manual-backup-key', ContentPrefix.BACKUP);
        const backupMetadata = {
            backupType: BackupType.MANUAL,
            name: 'manual-backup-name'
        };

        inMemoryCdn[backupKey] = {
            body: 'manual-backup-data',
            contentType: ContentType.JSON,
            metadata: backupMetadata
        };

        await siteUpdater.deleteManualBackup(backupKey);

        expect(inMemoryCdn).not.toHaveProperty(backupKey);
    });

    test('deleteManualBackup should delete manual backup', async () => {
        const backupKey = prefixKey('manual-backup-key', ContentPrefix.BACKUP);
        const backupMetadata = {
            backupType: BackupType.AUTO,
            name: 'manual-backup-name'
        };

        inMemoryCdn[backupKey] = {
            body: 'auto-backup-data',
            contentType: ContentType.JSON,
            metadata: backupMetadata
        };

        await expect(siteUpdater.deleteManualBackup(backupKey)).rejects.toThrow('Not a manual backup');
    });

    test('restoreBackup should restore backups', async () => {
        // create initial auto backup
        await siteUpdater.updateSiteData();

        // grab first backup
        const backups = await siteUpdater.listBackups();
        const oldBackup = backups[0].key;

        // make change to general data
        const update = "UPDATE";

        generalDataService.update({
            about: {
                text: update
            }
        });

        // make change to houses
        const neighborhood = "Test Neighborhood";

        await houseService.upsertHouse({
            neighborhood: neighborhood,
            address: "Test",
            images: [],
            mainImage: 'https://cdn.house.com/production/hero-1.jpg',
            isDeveloped: false,
            isForSale: false,
            isSelectedWork: false,
        });

        // apply changes and auto backup again
        await siteUpdater.updateSiteData();

        // find new backup
        const newBackups = await siteUpdater.listBackups();
        expect(newBackups).toHaveLength(2);

        const newBackup = newBackups[0].key === oldBackup ? newBackups[1].key : newBackups[0].key;

        // restore old backup
        await siteUpdater.restoreBackup(oldBackup);

        // make sure general data is NOT updated
        const generalData = await generalDataService.getGeneralData();
        expect(generalData.about.text).not.toBe(update);

        // make sure houses are NOT updated
        const houses = await houseService.getHouseObjects();
        expect(houses).toHaveLength(0);

        // restore the new backup that contains the changes
        await siteUpdater.restoreBackup(newBackup);

        // check to make sure general data now reflects changes
        const newGeneralData = await generalDataService.getGeneralData();
        expect(newGeneralData.about.text).toBe(update);

        // make sure new house is there
        const newHouses = await houseService.getHouseObjects();
        expect(newHouses).toHaveLength(1);
        expect(newHouses[0].neighborhood).toBe(neighborhood);

        // make sure restores created new backups
        const restoreBackups = await siteUpdater.listBackups();
        expect(restoreBackups).toHaveLength(4);
    });
});
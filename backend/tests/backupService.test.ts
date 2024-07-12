import { CdnKeys } from "living-mile-high-lib";
import { BackupService, CdnAdapter, GeneralDataService, HouseService, StateService } from "~/@types";
import { ContentPrefix, ContentType, BackupType } from "~/@types/constants";
import { updateSiteData } from "~/controllers/siteUpdateController";
import { services } from "~/di";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { prefixKey } from "~/utils/misc";

let backupService: BackupService;
let stateService: StateService;
let cdnAdapter: CdnAdapter;
let houseService: HouseService;
let generalDataService: GeneralDataService;

beforeAll(() => {
    ({ backupService, cdnAdapter, stateService, houseService, generalDataService } = services());
});

async function updateSiteDataAndAutoBackup(): Promise<void> {
    const siteData = await stateService.getState();

    await cdnAdapter.putObject({
        key: CdnKeys.SITE_DATA,
        body: JSON.stringify(siteData),
        contentType: ContentType.JSON
    });

    await backupService.createAutoBackup();
}

describe("backup service", () => {
    test('listBackups should list backups', async () => {
        const name = "Hello World";

        const key = 'backup-key';
        const prefixedKey = prefixKey(key, ContentPrefix.BACKUP);

        cdnAdapter.putObject({
            key: key,
            body: 'body',
            contentType: ContentType.JSON,
            prefix: ContentPrefix.BACKUP,
            metadata: {
                name: name
            }
        });

        const backups = await backupService.listBackups();

        expect(backups).toEqual([{
            name: name,
            key: prefixedKey
        }]);
    });

    test('createManualBackup should create a manual backup', async () => {
        const backupName = 'manual-backup';

        await backupService.createManualBackup(backupName);

        const backups = await backupService.listBackups();

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

        await backupService.deleteManualBackup(backupKey);

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

        await expect(backupService.deleteManualBackup(backupKey)).rejects.toThrow('Not a manual backup');
    });

    test('restoreBackup should restore backups', async () => {
        // create initial auto backup
        await updateSiteData();

        // grab first backup
        const backups = await backupService.listBackups();
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
        await updateSiteData();

        // find new backup
        const newBackups = await backupService.listBackups();
        expect(newBackups).toHaveLength(2);

        const newBackup = newBackups[0].key === oldBackup ? newBackups[1].key : newBackups[0].key;

        // restore old backup
        await backupService.restoreBackup(oldBackup);

        // make sure general data is NOT updated
        const generalData = await generalDataService.getGeneralData();
        expect(generalData.about.text).not.toBe(update);

        // make sure houses are NOT updated
        const houses = await houseService.getHouseObjects();
        expect(houses).toHaveLength(0);

        // restore the new backup that contains the changes
        await backupService.restoreBackup(newBackup);

        // check to make sure general data now reflects changes
        const newGeneralData = await generalDataService.getGeneralData();
        expect(newGeneralData.about.text).toBe(update);

        // make sure new house is there
        const newHouses = await houseService.getHouseObjects();
        expect(newHouses).toHaveLength(1);
        expect(newHouses[0].neighborhood).toBe(neighborhood);

        // make sure restores created new backups
        const restoreBackups = await backupService.listBackups();
        expect(restoreBackups).toHaveLength(4);
    });
});
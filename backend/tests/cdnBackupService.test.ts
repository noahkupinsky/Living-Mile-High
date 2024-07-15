import { Readable } from "stream";
import { BackupService, CdnAdapter, GeneralDataService, HouseService } from "~/@types";
import { ContentCategory, ContentType, BackupType, BACKUP_LOGARITHMIC_BASE as BASE } from "~/@types/constants";
import { services } from "~/di";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { prefixKey } from "~/utils/misc";

let backupService: BackupService;
let cdnAdapter: CdnAdapter;
let houseService: HouseService;
let generalDataService: GeneralDataService;

beforeAll(() => {
    ({ backupService, cdnAdapter, houseService, generalDataService } = services());
});

describe("backup service", () => {
    test('getBackupIndices should get backup indices correctly', async () => {
        const name = "Hello World";

        const key = 'backup-key';
        const prefixedKey = prefixKey(key, ContentCategory.BACKUP);

        await cdnAdapter.putObject({
            key: key,
            body: 'body',
            contentType: ContentType.JSON,
            prefix: ContentCategory.BACKUP,
            metadata: {
                name: name
            }
        });

        const backups = await backupService.getBackupIndices();

        expect(backups).toEqual([{
            name: name,
            key: prefixedKey,
            createdAt: expect.any(Date),
        }]);
    });

    test('createManualBackup should create a manual backup', async () => {
        const backupName = 'manual-backup';

        await backupService.createManualBackup(backupName);

        const backups = await backupService.getBackupIndices();

        expect(backups).toHaveLength(1);
        expect(backups[0].name).toBe(backupName);
    });

    test('deleteManualBackup should delete manual backup', async () => {
        const backupKey = prefixKey('manual-backup-key', ContentCategory.BACKUP);
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
        const backupKey = prefixKey('manual-backup-key', ContentCategory.BACKUP);
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
        //make sure general data singleton exists
        await generalDataService.getGeneralData();
        // create initial auto backup
        await backupService.createAutoBackup();

        // grab first backup
        const backups = await backupService.getBackupIndices();
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
        await backupService.createAutoBackup();

        // find new backup
        const newBackups = await backupService.getBackupIndices();
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
        const restoreBackups = await backupService.getBackupIndices();
        expect(restoreBackups).toHaveLength(4);
    });

    test('pruneBackups should delete expired automatic backups', async () => {
        const backupKey1 = prefixKey('key-1', ContentCategory.BACKUP);
        const backupKey2 = prefixKey('key-2', ContentCategory.BACKUP);

        const currentDate = new Date();
        const pastDate = new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 10); // 10 days ago
        const futureDate = new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 10); // 10 days in the future

        inMemoryCdn[backupKey1] = {
            body: 'backup-data-1',
            contentType: ContentType.JSON,
            metadata: {
                name: 'backup1',
                backupType: BackupType.AUTO,
                expiration: pastDate.toISOString()
            }
        };

        inMemoryCdn[backupKey2] = {
            body: 'backup-data-2',
            contentType: ContentType.JSON,
            metadata: {
                name: 'backup2',
                backupType: BackupType.AUTO,
                expiration: futureDate.toISOString()
            }
        };

        await backupService.pruneAutoBackups();

        expect(inMemoryCdn).not.toHaveProperty(backupKey1);
        expect(inMemoryCdn).toHaveProperty(backupKey2);
    });

    test('pruneBackups should not delete manual backups', async () => {
        const backupKey1 = prefixKey('key-1', ContentCategory.BACKUP);

        inMemoryCdn[backupKey1] = {
            body: 'backup-data-1',
            contentType: ContentType.JSON,
            metadata: {
                name: 'backup1',
                backupType: BackupType.MANUAL,
            }
        };

        await backupService.pruneAutoBackups();

        expect(inMemoryCdn).toHaveProperty(backupKey1);
    });

    test('renameManualBackup should rename a manual backup', async () => {
        const initialName = 'Initial Backup';
        const newName = 'Renamed Backup';

        const key = await cdnAdapter.putObject({
            key: 'manual-1',
            body: `{"data": "${initialName}"}`,
            contentType: ContentType.JSON,
            prefix: ContentCategory.BACKUP,
            metadata: {
                name: initialName,
                backupType: BackupType.MANUAL,
                createdAt: new Date().toISOString()
            }
        });

        // Verify the initial state
        expect(inMemoryCdn[key].metadata.name).toBe(initialName);

        // Perform the renaming
        await backupService.renameManualBackup(key, newName);

        // Verify the final state
        expect(inMemoryCdn[key].metadata.name).toBe(newName);
    });

    test('renameManualBackup should throw error if not a manual backup', async () => {
        const initialName = 'Initial Backup';

        const key = await cdnAdapter.putObject({
            key: 'auto-1',
            body: `{"data": "${initialName}"}`,
            contentType: ContentType.JSON,
            prefix: ContentCategory.BACKUP,
            metadata: {
                name: initialName,
                backupType: BackupType.AUTO,
                createdAt: new Date().toISOString()
            }
        });

        // Verify the initial state
        expect(inMemoryCdn[key].metadata.name).toBe(initialName);

        // Attempt to rename and expect an error
        await expect(backupService.renameManualBackup(key, 'Renamed Backup'))
            .rejects
            .toThrow('Not a manual backup');
    });
});

describe('backup consolidation', () => {
    const createBackup = async (name: string, timeDelta: number, backupPower: number = 0) => {
        const baseDate = new Date();
        const createdAt = new Date(baseDate.getTime() - timeDelta);
        const key = await cdnAdapter.putObject({
            key: name,
            body: `{"data": "${name}"}`,
            contentType: ContentType.JSON,
            prefix: ContentCategory.BACKUP,
            metadata: {
                name: name,
                backupType: BackupType.AUTO,
                createdAt: createdAt.toISOString(),
                backupPower: backupPower.toString()
            }
        });
        return key;
    };

    // Test consolidating oldest backups while persisting the most recent one
    test('consolidateAutoBackups should consolidate oldest backups and persist the most recent one', async () => {
        const backupKeys = [];
        for (let i = 1; i <= BASE; i++) {
            backupKeys.push(await createBackup(`backup-${i}`, i * 1000, 0));
        }

        // Perform consolidation
        await backupService.consolidateAutoBackups();

        // Expect the latest backup to have power 1 and only one backup remaining
        const latestBackupKey = backupKeys[0];
        const consolidatedBackup = inMemoryCdn[latestBackupKey];
        expect(consolidatedBackup.metadata.backupPower).toBe('1');
        expect(Object.keys(inMemoryCdn).length).toBe(1);
        expect(consolidatedBackup.metadata.name).toBe(`backup-1`);
    });

    // Test when there are not enough backups to consolidate
    test('consolidateAutoBackups should not consolidate if there are not enough backups', async () => {
        for (let i = 1; i < BASE; i++) {
            await createBackup(`backup-${i}`, i * 1000, 0);
        }

        // Perform consolidation
        await backupService.consolidateAutoBackups();

        // Expect no consolidation to have occurred
        expect(Object.keys(inMemoryCdn).length).toBe(BASE - 1);
    });

    // Test consolidating multiple levels of backups
    test('consolidateAutoBackups should handle multiple consolidation levels', async () => {
        const backupKeys = [];
        for (let i = 1; i <= BASE * 2; i++) {
            backupKeys.push(await createBackup(`backup-${i}`, i * 1000, 0));
        }

        // Perform consolidation
        await backupService.consolidateAutoBackups();

        // Expect two consolidated backups with power 1
        const keys = Object.keys(inMemoryCdn);
        const consolidatedBackup1 = inMemoryCdn[keys[0]];
        const consolidatedBackup2 = inMemoryCdn[keys[1]];

        expect(consolidatedBackup1.metadata.backupPower).toBe('1');
        expect(consolidatedBackup2.metadata.backupPower).toBe('1');
        expect(keys.length).toBe(2);
    });

    // Test handling previously consolidated backups
    test('consolidateAutoBackups should handle previously consolidated backups', async () => {
        const backupKeys = [];
        for (let i = 1; i <= BASE - 1; i++) {
            backupKeys.push(await createBackup(`backup-${i}`, i * 1000, 0));
        }
        backupKeys.push(await createBackup('backup-5', BASE * 1000, 1));
        backupKeys.push(await createBackup('backup-6', (BASE + 1) * 1000, 0));
        backupKeys.push(await createBackup('backup-7', (BASE + 2) * 1000, 0));

        // Perform consolidation
        await backupService.consolidateAutoBackups();

        // Expect three backups: one previously consolidated, one newly consolidated, and one remaining level 0
        const consolidatedBackup1 = Object.values(inMemoryCdn).find(b => b.metadata.name === 'backup-5');
        const consolidatedBackup2 = Object.values(inMemoryCdn).find(b => b.metadata.backupPower === '1' && b !== consolidatedBackup1);
        const remainingBackup = Object.values(inMemoryCdn).find(b => b.metadata.name === 'backup-7');

        expect(consolidatedBackup1!.metadata.backupPower).toBe('1');
        expect(consolidatedBackup2!.metadata.backupPower).toBe('1');
        expect(Object.keys(inMemoryCdn).length).toBe(3);
        expect(remainingBackup!.metadata.backupPower).toBe('0');
    });
});
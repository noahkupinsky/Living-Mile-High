import { BackupIndex, BackupType } from "living-mile-high-lib";
import { PriorityQueue } from "typescript-collections";
import { CdnAdapter, BackupHead, BackupService, StateService, Backup, BackupMetadata } from "~/@types";
import { BackupConfig, ContentCategory, ContentType } from "~/@types/constants";
import { createExpirationDate, streamToString } from "~/utils/misc";

type BackupPriority = { key: string; createdAt: Date; backupPower: number }

export class CdnBackupService implements BackupService {
    private stateService: StateService;
    private cdn: CdnAdapter;

    constructor(stateService: StateService, cdn: CdnAdapter) {
        this.stateService = stateService;
        this.cdn = cdn;
    }

    async deleteManualBackup(key: string): Promise<void> {
        const backup = await this.cdn.getHead(key);
        const backupType = backup.metadata.backupType;

        if (!backupType) {
            throw new Error('Not a backup');
        }

        const isManual = backup.metadata.backupType === BackupType.MANUAL;

        if (!isManual) {
            throw new Error('Not a manual backup');
        }

        await this.cdn.deleteObject(key);
    }

    async restoreBackup(key: string): Promise<void> {
        const backup = await this.cdn.getObject(key);
        const backupType = backup.metadata.backupType;

        if (!backupType) {
            throw new Error('Not a backup');
        }

        const dataString = await streamToString(backup.body);

        await this.stateService.deserializeState(dataString);
    }

    async getBackupIndices(): Promise<BackupIndex[]> {
        const backupHeads = await this.getBackupHeads();

        const indices = backupHeads.map(head => ({
            key: head.key,
            name: head.metadata.name!,
            createdAt: head.metadata.createdAt!,
            backupType: head.metadata.backupType!,
        }));

        const sortedIndices = indices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return sortedIndices;
    }

    async getBackupKeys(): Promise<string[]> {
        return await this.cdn.getKeys(ContentCategory.BACKUP);
    }

    async getBackupHeads(): Promise<BackupHead[]> {
        const keys = await this.getBackupKeys();
        return await this.cdn.getHeads(keys) as BackupHead[];
    }

    async getBackups(): Promise<Backup[]> {
        const keys = await this.getBackupKeys();
        return await this.cdn.getObjects(keys) as Backup[];
    }

    async createManualBackup(name: string): Promise<void> {
        await this.createBackup(BackupType.MANUAL, name);
    }

    async renameManualBackup(key: string, name: string): Promise<void> {
        const backup = await this.cdn.getHead(key);
        const backupType = backup.metadata.backupType!;

        if (backupType !== BackupType.MANUAL) {
            throw new Error('Not a manual backup');
        }

        await this.cdn.updateObjectMetadata(key, { name: name });
    }

    async createAutoBackup(): Promise<void> {
        await this.createBackup(BackupType.AUTO);
    }

    private async createBackup(backupType: BackupType, name?: string): Promise<void> {
        const backupData = await this.stateService.serializeState();
        const timestamp = new Date().toISOString();

        const expiration = backupType === BackupType.AUTO ? { expiration: createExpirationDate(BackupConfig.RETENTION_DAYS) } : {};
        const backupName = name || `${timestamp}`;

        const metadata: BackupMetadata = {
            backupType: backupType,
            createdAt: timestamp,
            backupPower: '0',
            name: backupName,
            ...expiration
        };

        const key = timestamp.replace(/\s/g, '_');

        await this.cdn.putObject({
            key: key,
            body: backupData,
            contentType: ContentType.JSON,
            prefix: ContentCategory.BACKUP,
            metadata: metadata
        });
    }

    async pruneAutoBackups(): Promise<void> {
        const backups = await this.getBackupHeads();

        backups.forEach(backup => this.pruneBackup(backup));
    }

    private async pruneBackup(backupHead: BackupHead): Promise<void> {
        if (this.isBackupExpired(backupHead)) {
            await this.cdn.deleteObject(backupHead.key);
        }
    }

    private isBackupExpired(backupHead: BackupHead): boolean {
        const currentDate = new Date();
        const metadata = backupHead.metadata;

        const isAutoBackup = (metadata.backupType === BackupType.AUTO);

        const hasExpiration = (metadata.expiration !== undefined);
        const isExpired = hasExpiration && currentDate > new Date(metadata.expiration!);

        return isAutoBackup && isExpired;
    }

    async consolidateAutoBackups(): Promise<void> {
        const backupQueue = await this.createConsolidationPriorityQueue();

        // Consolidate backups
        while (!backupQueue.isEmpty()) {
            const currentPower = backupQueue.peek()!.backupPower;
            const backupsToConsolidate: BackupPriority[] = [];

            while (!backupQueue.isEmpty() && backupQueue.peek()!.backupPower === currentPower && backupsToConsolidate.length < BackupConfig.LOGARITHMIC_BASE) {
                backupsToConsolidate.push(backupQueue.dequeue()!);
            }

            if (backupsToConsolidate.length >= BackupConfig.LOGARITHMIC_BASE) {
                const consolidatedBackup = await this.consolidateBackupSet(backupsToConsolidate);
                backupQueue.enqueue(consolidatedBackup);
            }
        }
    }

    private async consolidateBackupSet(backupsToConsolidate: BackupPriority[]): Promise<BackupPriority> {
        const sortRecentFirst = (a: BackupPriority, b: BackupPriority) => b.createdAt.getTime() - a.createdAt.getTime();
        const latestBackup = backupsToConsolidate.sort(sortRecentFirst)[0];
        const newPower = latestBackup.backupPower + 1;

        // Delete the old backups except the latest one
        const keysToDelete = backupsToConsolidate.filter(backup => backup.key !== latestBackup.key).map(b => b.key);

        if (keysToDelete.length > 0) {
            await this.cdn.deleteObjects(keysToDelete);
        }

        // Update metadata of the latest backup
        latestBackup.backupPower = newPower;
        await this.cdn.updateObjectMetadata(latestBackup.key, { backupPower: newPower.toString() });

        return latestBackup;
    }

    private async createConsolidationPriorityQueue(): Promise<PriorityQueue<BackupPriority>> {
        const backupHeads = await this.getBackupHeads();
        const autoBackups = backupHeads.filter(head => head.metadata.backupType === BackupType.AUTO);
        const nonMaximalAutoBackups = autoBackups.filter(head => this.getBackupPower(head) < BackupConfig.MAXIMUM_POWER);

        // Create a priority queue to sort backups by date and power
        const backupQueue = new PriorityQueue<BackupPriority>((a, b) => {
            if (a.backupPower !== b.backupPower) {
                // reversed to consolidate smaller backups first, ensuring maximum consolidation
                return b.backupPower - a.backupPower;
            }
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        nonMaximalAutoBackups.forEach(backup => {
            backupQueue.enqueue({
                key: backup.key,
                createdAt: new Date(backup.metadata.createdAt!),
                backupPower: this.getBackupPower(backup)
            });
        });

        return backupQueue;
    }

    private getBackupPower(backupHead: BackupHead): number {
        return parseInt(backupHead.metadata.backupPower!);
    }
}
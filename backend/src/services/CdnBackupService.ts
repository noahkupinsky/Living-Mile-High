import { BackupIndex } from "living-mile-high-lib";
import { Readable } from "stream";
import { PriorityQueue } from "typescript-collections";
import { CdnAdapter, CdnContent, BackupService, StateService, CdnMetadata } from "~/@types";
import { BACKUP_LOGARITHMIC_BASE, BACKUP_RETENTION_DAYS, BackupType, ContentPrefix, ContentType } from "~/@types/constants";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { streamToString } from "~/utils/misc";

type BackupPriority = { key: string; createdAt: Date; backupPower: number }

export class CdnBackupService implements BackupService {
    private stateService: StateService;
    private cdn: CdnAdapter;

    constructor(stateService: StateService, cdn: CdnAdapter) {
        this.stateService = stateService;
        this.cdn = cdn;
    }

    async deleteManualBackup(key: string): Promise<void> {
        const backup = await this.cdn.getObject(key);
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

        await this.createBackup(BackupType.AUTO);
    }

    async getBackupIndices(): Promise<BackupIndex[]> {
        const keys = await this.getBackupKeys();

        const backups = await this.cdn.getObjects(keys);

        const indices = backups.map(backup => ({
            key: backup.key,
            name: backup.metadata.name!
        }));

        return indices;
    }

    async getBackupKeys(): Promise<string[]> {
        return await this.cdn.getKeys(ContentPrefix.BACKUP);
    }

    async getBackups(): Promise<CdnContent[]> {
        const keys = await this.getBackupKeys();
        return await this.cdn.getObjects(keys);
    }

    async createManualBackup(name: string): Promise<void> {
        await this.createBackup(BackupType.MANUAL, name);
    }

    async createAutoBackup(): Promise<void> {
        await this.createBackup(BackupType.AUTO);
    }

    private async createBackup(backupType: BackupType, name?: string): Promise<void> {
        const backupData = await this.stateService.serializeState();
        const timestamp = new Date().toISOString();

        const expiration = backupType === BackupType.AUTO ? { expiration: this.getExpirationDate() } : {};
        const backupName = name || `${timestamp}`;

        const metadata: CdnMetadata = {
            backupType,
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
            prefix: ContentPrefix.BACKUP,
            metadata: metadata
        });
    }

    private getExpirationDate(): string {
        const date = new Date();
        date.setDate(date.getDate() + BACKUP_RETENTION_DAYS);
        return date.toISOString();
    }

    async pruneBackups(): Promise<void> {
        const backupKeys = await this.getBackupKeys();
        const backups = await this.cdn.getObjects(backupKeys);

        backups.forEach(backup => this.pruneBackup(backup));
    }

    private async pruneBackup(backup: CdnContent): Promise<void> {
        if (this.isBackupExpired(backup)) {
            await this.cdn.deleteObject(backup.key);
        }
    }

    private isBackupExpired(backup: CdnContent): boolean {
        const currentDate = new Date();
        const metadata = backup.metadata;

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

            while (!backupQueue.isEmpty() && backupQueue.peek()!.backupPower === currentPower && backupsToConsolidate.length < BACKUP_LOGARITHMIC_BASE) {
                backupsToConsolidate.push(backupQueue.dequeue()!);
            }

            if (backupsToConsolidate.length >= BACKUP_LOGARITHMIC_BASE) {
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
        const backups = await this.getBackups();
        const automaticBackups = backups.filter(backup => backup.metadata.backupType === BackupType.AUTO);

        // Create a priority queue to sort backups by date and power
        const backupQueue = new PriorityQueue<BackupPriority>((a, b) => {
            if (a.backupPower !== b.backupPower) {
                return a.backupPower - b.backupPower;
            }
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        automaticBackups.forEach(backup => {
            backupQueue.enqueue({
                key: backup.key,
                createdAt: new Date(backup.metadata.createdAt!),
                backupPower: this.getBackupPower(backup)
            });
        });

        return backupQueue;
    }

    private getBackupPower(backup: CdnContent): number {
        return parseInt(backup.metadata.backupPower!);
    }
}
import { BackupIndex } from "living-mile-high-lib";
import { Readable } from "stream";
import { CdnAdapter, GetCommandOutput, BackupService, StateService } from "~/@types";
import { BACKUP_RETENTION_DAYS, BackupType, ContentPrefix, ContentType } from "~/@types/constants";
import { streamToString } from "~/utils/misc";

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

    async getBackups(): Promise<GetCommandOutput[]> {
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

        const metadata = {
            backupType,
            createdAt: timestamp,
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
        // if (backupType === BackupType.AUTO) {
        //     await this.logarithmicBackupProcess();
        // }
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

    private async pruneBackup(backup: GetCommandOutput): Promise<void> {
        if (this.isBackupExpired(backup)) {
            await this.cdn.deleteObject(backup.key);
        }
    }

    private isBackupExpired(backup: GetCommandOutput): boolean {
        const currentDate = new Date();
        const metadata = backup.metadata;

        const isAutoBackup = (metadata.backupType === BackupType.AUTO);

        const hasExpiration = (metadata.expiration !== undefined);
        const isExpired = hasExpiration && currentDate > new Date(metadata.expiration!);

        return isAutoBackup && isExpired;
    }
}
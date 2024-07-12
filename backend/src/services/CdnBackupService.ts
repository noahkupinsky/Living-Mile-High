import axios, { AxiosError } from "axios";

import { BackupIndex, CdnKeys } from "living-mile-high-lib";
import { Readable } from "stream";
import { CdnAdapter, GetCommandOutput, BackupService, StateService } from "~/@types";
import { BACKUP_RETENTION_DAYS, BackupType, ContentPrefix, ContentType } from "~/@types/constants";
import { AppDataValidator } from "~/utils/AppDataValidator";
import { streamToBuffer } from "~/utils/misc";

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

        const buffer = await streamToBuffer(backup.body as Readable);
        const data = buffer.toString('utf-8');

        await this.stateService.deserializeState(data);

        await this.createBackup(BackupType.AUTO);
    }

    async listBackups(): Promise<BackupIndex[]> {
        const keys = await this.cdn.getKeys(ContentPrefix.BACKUP);

        const backups = await this.cdn.getObjects(keys);

        const indices = backups.map(backup => ({
            key: backup.key,
            name: backup.metadata.name!
        }));

        return indices;
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

        const key = timestamp.replace(/\D/g, '_');

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

    // TODO: prune backups, prune assets, logarithmic
}
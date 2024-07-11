import axios, { AxiosError } from "axios";

import { BackupIndex, CdnKeys } from "living-mile-high-lib";
import { Readable } from "stream";
import { CdnAdapter, GetCommandOutput, SiteUpdater, StateService } from "~/@types";
import { BACKUP_RETENTION_DAYS, BackupType, ContentPrefix, ContentType } from "~/@types/constants";
import { AppDataValidator } from "~/utils/AppDataValidator";
import { streamToBuffer } from "~/utils/misc";

export async function downloadImage(url: string): Promise<{ buffer: Buffer, contentType: ContentType }> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        buffer: Buffer.from(response.data),
        contentType: response.headers['content-type']
    };
}

export class CdnSiteUpdater implements SiteUpdater {
    private stateService: StateService;
    private cdn: CdnAdapter;

    constructor(stateService: StateService, cdn: CdnAdapter) {
        this.stateService = stateService;
        this.cdn = cdn;
    }

    async updateSiteData(): Promise<void> {
        const siteData = await this.stateService.getState();

        if (!AppDataValidator.validate(siteData)) {
            throw new Error('Invalid AppData');
        }

        await this.updateHomePageFirst(siteData.homePageImages);

        await this.cdn.putObject({
            key: CdnKeys.SITE_DATA,
            body: JSON.stringify(siteData),
            contentType: ContentType.JSON
        });

        await this.createBackup(BackupType.AUTO);
    }

    private async updateHomePageFirst(homePageImages: string[]): Promise<void> {
        try {
            const firstImageUrl = homePageImages[0];

            const { buffer, contentType } = await downloadImage(firstImageUrl);

            await this.cdn.putObject({
                key: CdnKeys.HOME_PAGE_FIRST,
                body: buffer,
                contentType: contentType
            });
        } catch (error: any) {
            if (!(error instanceof AxiosError)) {
                throw error;
            }
        }
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
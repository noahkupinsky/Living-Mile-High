import { BackupIndex, BackupType } from "living-mile-high-lib";
import { ContentCategory, ContentType, ContentPermission } from "./constants";

export type BackupMetadata = {
    backupType: BackupType,
    backupPower: string,
    createdAt: string,
    name: string
    expiration?: string,
}

export type Backup = {
    key: string,
    metadata: BackupMetadata,
    body: any
}

export interface BackupService {
    deleteManualBackup(key: string): Promise<void>;
    restoreBackup(key: string): Promise<void>;
    getBackupIndices(): Promise<BackupIndex[]>;
    getBackupKeys(): Promise<string[]>;
    getBackups(): Promise<Backup[]>;
    createManualBackup(name: string): Promise<void>;
    renameManualBackup(key: string, name: string): Promise<void>;
    createAutoBackup(): Promise<void>;
    pruneAutoBackups(): Promise<void>;
    consolidateAutoBackups(): Promise<void>;
}

// CdnMetadata is a superset of all metadatas
export type CdnMetadata = Partial<BackupMetadata>

export type PutCommand = {
    key: string,
    body: any,
    contentType: ContentType,
    prefix?: ContentCategory,
    metadata?: CdnMetadata,
    permission?: ContentPermission
}

export type CdnContent = {
    key: string,
    body: StreamingBlobPayloadOutputTypes,
    contentType: ContentType,
    metadata: CdnMetadata
}

export interface CdnAdapter {
    public getObjectUrl(key: string): string;
    public generateUniqueKey(): string;
    public extractKeys(object: any): string[];
    public putObject(command: PutCommand): Promise<string>;
    public getObject(key: string): Promise<CdnContent>;
    public getObjects(keys: string[]): Promise<CdnContent[]>;
    public deleteObject(key: string): Promise<void>;
    public deleteObjects(keys: string[]): Promise<void>;
    public getKeys(prefix?: ContentCategory): Promise<string[]>
    public updateObjectMetadata(key: string, updates: Partial<CdnMetadata>): Promise<void>;
}

export type S3Config = {
    client: S3Client,
    bucket: string,
    baseUrl: string
}

export interface ImageService {
    uploadImage(file: any): Promise<string>;
}


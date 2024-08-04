import { BackupIndex, BackupType } from "living-mile-high-lib";
import { ContentCategory, ContentType, ContentPermission } from "./constants";

export type BackupMetadata = {
    backupType: BackupType,
    backupPower: string,
    createdAt: string,
    name: string
    expiration?: string,
}

export type BackupHead = {
    key: string,
    metadata: BackupMetadata
}

export type Backup = BackupHead & {
    body: any
}

export interface BackupService {
    deleteManualBackup(key: string): Promise<void>;
    restoreBackup(key: string): Promise<void>;
    getBackupIndices(): Promise<BackupIndex[]>;
    getBackupKeys(): Promise<string[]>;
    getBackupHeads(): Promise<BackupHead[]>;
    getBackups(): Promise<Backup[]>;
    createManualBackup(name: string): Promise<void>;
    renameManualBackup(key: string, name: string): Promise<void>;
    createAutoBackup(): Promise<void>;
    pruneAutoBackups(): Promise<void>;
    consolidateAutoBackups(): Promise<void>;
}

export type AssetMetadata = {
    expiration: string,
}

export interface AssetService {
    uploadAsset(file: any): Promise<string>;
    getExpiredAssets(keys: string[]): Promise<string[]>;
}

// CdnMetadata is a superset of all metadatas
export type CdnMetadata = Partial<BackupMetadata> & Partial<AssetMetadata>;

export type PutCommand = {
    key: string,
    body: any,
    contentType: ContentType,
    prefix?: ContentCategory,
    metadata?: CdnMetadata,
    permission?: ContentPermission
}

export type CdnHead = {
    key: string,
    metadata: CdnMetadata,
    contentType: ContentType
}

export type CdnContent = CdnHead & {
    body: StreamingBlobPayloadOutputTypes,
}

export type RefreshCdnCache = (keys?: string[]) => Promise<void>;

export interface CdnAdapter {
    public getObjectUrl(key: string): string;
    public generateUniqueKey(): string;
    public extractKeys(object: any): string[];
    public putObject(command: PutCommand): Promise<string>;
    public getObject(key: string): Promise<CdnContent>;
    public getObjects(keys: string[]): Promise<CdnContent[]>;
    public getHead(key: string): Promise<CdnHead>;
    public getHeads(keys: string[]): Promise<CdnHead[]>
    public deleteObject(key: string): Promise<void>;
    public deleteObjects(keys: string[]): Promise<void>;
    public getKeys(prefix?: ContentCategory): Promise<string[]>
    public updateObjectMetadata(key: string, updates: Partial<CdnMetadata>): Promise<void>;
    public refreshCache(): Promise<void>;
}

export type S3Config = {
    client: S3Client,
    bucket: string,
    baseUrl: string,
    refreshCache?: RefreshCdnCache,
}


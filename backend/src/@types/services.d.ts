import { SiteData, DeepPartial, BackupIndex } from "living-mile-high-lib";
import { ContentCategory, ContentType } from "./constants";
import { GeneralData } from "./database";
import {
    CopyObjectCommandOutput, DeleteObjectCommandOutput, GetObjectCommandOutput, PutObjectAclCommandOutput,
} from "@aws-sdk/client-s3";

export interface ServiceManager<T> {
    public connect(): Promise<T>;
    public disconnect(): Promise<void>;
}

export type ServiceDict = {
    houseService: HouseService;
    adminService: AdminService;
    imageService: ImageService;
    cdnAdapter: CdnAdapter;
    generalDataService: GeneralDataService;
    stateService: StateService;
    backupService: BackupService;
};

export type SiteServiceManager = ServiceManager<ServiceDict>;

export type CdnMetadata = {
    backupType?: BackupType,
    backupPower?: string,
    createdAt?: string,
    expiration?: string,
    name?: string
}

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
    public deleteObject(key: string): Promise<DeleteObjectCommandOutput>;
    public deleteObjects(keys: string[]): Promise<DeleteObjectCommandOutput[]>;
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

export interface HouseService {
    getHouseObjects(): Promise<House[]>;
    upsertHouse(house: DeepPartial<House>): Promise<void>;
    allImages(): Promise<string[]>;
    allNeighborhoods(): Promise<string[]>;
}

export interface AdminService {
    getUserByLoginInfo(username: string, password: string): Promise<any>;
    createUser(username: string, password: string): Promise<any>;
    getUserById(id: string): Promise<any>;
}

export interface GeneralDataService {
    update(updates: DeepPartial<GeneralData>): Promise<void>;
    getGeneralData(): Promise<GeneralData>;
}

export interface BackupService {
    deleteManualBackup(key: string): Promise<void>;
    restoreBackup(key: string): Promise<void>;
    getBackupIndices(): Promise<BackupIndex[]>;
    getBackupKeys(): Promise<string[]>;
    getBackups(): Promise<CdnContent[]>;
    createManualBackup(name: string): Promise<void>;
    renameManualBackup(key: string, name: string): Promise<void>;
    createAutoBackup(): Promise<void>;
    pruneBackups(): Promise<void>;
    consolidateAutoBackups(): Promise<void>;
}

export interface StateService {
    getState(): Promise<SiteData>;
    serializeState(): Promise<string>;
    deserializeState(state: string): Promise<void>;
}
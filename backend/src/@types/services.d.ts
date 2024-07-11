import { SiteData, DeepPartial } from "living-mile-high-lib";
import { ContentPrefix } from "./constants";
import { GeneralData } from "./database";
import { GetObjectCommandOutput, CopyObjectCommandOutput, DeleteObjectCommandOutput, PutObjectAclCommandOutput } from "@aws-sdk/client-s3";

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
    siteUpdater: SiteUpdater;
};

export type SiteServiceManager = ServiceManager<ServiceDict>;

export interface CdnAdapter {
    public getObjectUrl(key: string): string;
    public generateUniqueKey(): string;
    public extractKeys(object: any): string[];
    public putObject(key: string, body: any, contentType: string, prefix?: ContentPrefix): Promise<PutObjectAclCommandOutput>;
    public getObject(key: string): Promise<GetObjectCommandOutput>;
    public moveObject(sourceKey: string, destinationKey: string): Promise<CopyObjectCommandOutput>;
    public deleteObject(key: string): Promise<DeleteObjectCommandOutput>;
    public getKeys(prefix?: ContentPrefix): Promise<string[]>
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

export interface SiteUpdater {
    updateSiteData(): Promise<void>;
    deleteBackup(name: string): Promise<void>;
    restoreBackup(name: string): Promise<void>;
    listBackups(): Promise<string[]>;
    createBackup(name: string): Promise<void>;
}

export interface StateService {
    getState(): Promise<SiteData>;
    serializeState(): Promise<string>;
    deserializeState(state: string): Promise<void>;
}
import { SiteData, DeepPartial } from "living-mile-high-lib";
import { ImageCategory } from "./enums";
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
    appDataService: AppDataService;
    cdnAdapter: CdnAdapter;
    generalDataService: GeneralDataService;
};

export interface CdnAdapter {
    public getObjectUrl(key: string): string;
    public generateUniqueKey(prefix: string): string;
    public extractKeys(object: any): string[];
    public putObject(key: string, body: any, contentType: string): Promise<PutObjectAclCommandOutput>;
    public getObject(key: string): Promise<GetObjectCommandOutput>;
    public moveObject(sourceKey: string, destinationKey: string): Promise<CopyObjectCommandOutput>;
    public deleteObject(key: string): Promise<DeleteObjectCommandOutput>;
    public getAllKeys(): Promise<string[]>
}

export type S3Config = {
    client: S3Client,
    bucket: string,
    baseUrl: string
}

export interface ImageService {
    uploadImage(file: any): Promise<string>;
}

export interface AppDataService {
    update(): Promise<SiteData>;
    // garbageCollect(): Promise<number>;
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
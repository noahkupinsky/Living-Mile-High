import { AppData, DeepPartial } from "living-mile-high-lib";
import { ImageCategory } from "./enums";
import { OtherData } from "./database";

export interface ServiceManager<Services> {
    public connect(): Promise<Services>;
    public disconnect(): Promise<void>;
}

export type AppServices = {
    houseService: HouseService;
    adminService: AdminService;
    imageService: ImageService;
    appDataService: AppDataService;
    cdnAdapter: CdnAdapter;
    otherService: OtherService;
};

export interface CdnAdapter {
    public getObjectUrl(key: string): string;
    public generateUniqueKey(prefix: string): string;
    public extractKeys(object: any): string[];
    public putObject(key: string, body: any, contentType: string): Promise<boolean>;
    public getObject(key: string): Promise<GetObjectCommandOutput>;
    public moveObject(sourceKey: string, destinationKey: string): Promise<boolean>;
    public deleteObject(key: string): Promise<boolean>;
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
    update(): Promise<AppData>;
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

export interface OtherService {
    update(updates: DeepPartial<OtherData>): Promise<void>;
    getOtherObject(): Promise<OtherData>;
}
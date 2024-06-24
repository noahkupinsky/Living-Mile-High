import { AppDataService } from "./appData";
import { ImageService } from "./image";
import { ServiceProvider } from "./serviceProvider";

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

export type CdnServiceProvider = ServiceProvider<CdnServiceDict>

export type CdnServiceDict = { imageService: ImageService, appDataService: AppDataService };

export type S3CdnConfig = {
    client: S3Client,
    bucket: string,
    baseUrl: string
}
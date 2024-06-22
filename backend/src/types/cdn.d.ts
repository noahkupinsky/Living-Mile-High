import { AppDataService } from "./appData";
import { ImageService } from "./image";
import { ServiceProvider } from "./serviceProvider";

export interface CdnAdapter {
    public getObjectUrl(objectKey: string): string;
    public generateUniqueKey(prefix: string): string;
    public putObject(objectKey: string, body: any, contentType: string): Promise<boolean>;
    public getObject(objectKey: string): Promise<GetObjectCommandOutput>;
    public deleteObject(objectKey: string): Promise<boolean>;
    public uploadImage(file: any, prefix: string): Promise<string>;
    public garbageCollect(references: Object): Promise<number>;
}

export type CdnServiceProvider = ServiceProvider<CdnServiceDict>

export type CdnServiceDict = { imageService: ImageService, appDataService: AppDataService };

export type S3CdnConfig = {
    client: S3Client,
    bucket: string,
    baseUrl: string
}
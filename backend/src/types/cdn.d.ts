import { ImageService } from "./image";

export interface CdnAdapter {
    public getObjectUrl(objectKey: string): string;
    public generateUniqueKey(prefix: string): string;
    public async putObject(objectKey: string, body: any, contentType: string): Promise<boolean>;
    public async getObject(objectKey: string): Promise<any>;
    public async deleteObject(objectKey: string): Promise<boolean>;
    public async uploadImage(file: any, prefix: string): Promise<string>;
    public async garbageCollect(references: Object): Promise<number>;
}

export interface CdnServiceProvider implements ServiceProvider<CdnServiceDict> {
    get services(): CdnServiceDict;
}

export type CdnServiceDict = { imageService: ImageService }

export type S3CdnConfig = {
    client: S3Client,
    bucket: string,
    cdnBaseUrl?: string // Optional base URL for custom CDNs
}
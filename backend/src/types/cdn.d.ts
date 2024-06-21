export interface CdnService {
    public getObjectUrl(objectKey: string): string;
    public generateUniqueKey(prefix: string): string;
    public async putObject(objectKey: string, body: any, contentType: string): Promise<boolean>;
    public async getObject(objectKey: string): Promise<any>;
    public async deleteObject(objectKey: string): Promise<boolean>;
    public async uploadImage(file: any, prefix: string): Promise<string>;
    public async garbageCollect(references: Object): Promise<number>;
}

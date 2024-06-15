
export interface ImageService {
    async connect(): Promise<void>;
    async disconnect(): Promise<void>;
    async uploadImage(file: any): Promise<any>;
    async garbageCollect(referencedImaged: Iterable<string>): Promise<void>
}
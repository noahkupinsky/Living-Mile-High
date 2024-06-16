
export interface ImageService {
    async uploadImage(file: any): Promise<any>;
    async garbageCollect(referencedImaged: Iterable<string>): Promise<void>
}
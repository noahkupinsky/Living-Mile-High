
export interface ImageService {
    uploadImage(file: any): Promise<any>;
    garbageCollect(referencedImaged: Iterable<string>): Promise<void>
}
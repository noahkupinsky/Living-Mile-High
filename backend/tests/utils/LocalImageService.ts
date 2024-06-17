import { ImageService } from "src/@types";

export class LocalImageService implements ImageService {
    async connect(): Promise<void> {
        return;
    }
    async disconnect(): Promise<void> {
        return;
    }
    async uploadImage(file: any): Promise<any> {
        return;
    }
    async garbageCollect(referencedImaged: Iterable<string>): Promise<void> {
        return;
    }
    async clear(): Promise<void> {
        return;
    }
}
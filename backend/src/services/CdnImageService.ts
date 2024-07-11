import { ImageService, CdnAdapter } from '~/@types';
import { ContentPrefix } from '~/@types/constants';

export class CdnImageService implements ImageService {
    private cdn: CdnAdapter;

    constructor(cdn: CdnAdapter) {
        this.cdn = cdn;
    }

    public async uploadImage(file: any): Promise<string> {
        const objectKey = this.cdn.generateUniqueKey();

        try {
            await this.cdn.putObject(objectKey, file.buffer, file.mimetype, ContentPrefix.asset);
            return this.cdn.getObjectUrl(objectKey);
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}
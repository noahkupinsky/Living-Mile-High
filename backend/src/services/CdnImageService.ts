import { AssetPrefix } from '~/@types/constants';
import { ImageService, CdnAdapter } from '~/@types';

export class CdnImageService implements ImageService {
    private cdn: CdnAdapter;

    constructor(cdn: CdnAdapter) {
        this.cdn = cdn;
    }

    public async uploadImage(file: any): Promise<string> {
        const objectKey = this.cdn.generateUniqueKey(AssetPrefix);

        try {
            await this.cdn.putObject(objectKey, file.buffer, file.mimetype);
            return this.cdn.getObjectUrl(objectKey);
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}
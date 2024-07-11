import { ImageService, CdnAdapter } from '~/@types';
import { ContentPrefix, ContentType } from '~/@types/constants';

export class CdnImageService implements ImageService {
    private cdn: CdnAdapter;

    constructor(cdn: CdnAdapter) {
        this.cdn = cdn;
    }

    public async uploadImage(file: any): Promise<string> {
        const objectKey = this.cdn.generateUniqueKey();

        const contentType = file.mimetype;

        if (!Object.values(ContentType).includes(contentType)) {
            throw new Error(`Invalid content type: ${contentType}`);
        }

        try {
            await this.cdn.putObject({
                key: objectKey,
                body: file.buffer,
                contentType: contentType,
                prefix: ContentPrefix.ASSET
            });
            return this.cdn.getObjectUrl(objectKey);
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}
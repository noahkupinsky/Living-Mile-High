import { ImageService, CdnAdapter } from '~/@types';
import { AssetMetadata, CdnContent } from '~/@types/cdnServices';
import { ASSSET_RETENTION_DAYS, ContentCategory, ContentType } from '~/@types/constants';
import { createExpirationDate } from '~/utils/misc';

export class CdnAssetService implements ImageService {
    private cdn: CdnAdapter;

    constructor(cdn: CdnAdapter) {
        this.cdn = cdn;
    }

    public async uploadAsset(file: any): Promise<string> {
        const objectKey = this.cdn.generateUniqueKey();

        const contentType = file.mimetype;

        if (!Object.values(ContentType).includes(contentType)) {
            throw new Error(`Invalid content type: ${contentType}`);
        }

        const metadata: AssetMetadata = {
            expiration: createExpirationDate(ASSSET_RETENTION_DAYS)
        };

        try {
            const prefixedKey = await this.cdn.putObject({
                key: objectKey,
                body: file.buffer,
                contentType: contentType,
                prefix: ContentCategory.ASSET,
                metadata: metadata
            });
            return this.cdn.getObjectUrl(prefixedKey);
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    public async getExpiredAssets(keys: string[]): Promise<string[]> {
        const images = await this.cdn.getObjects(keys);
        const expiredImages = images.filter(image => this.isImageExpired(image));
        const expiredKeys = expiredImages.map(image => image.key);
        return expiredKeys;
    }

    private isImageExpired(image: CdnContent): boolean {
        const expirationString = image.metadata.expiration;
        return !expirationString || new Date(expirationString!) < new Date();
    }
}
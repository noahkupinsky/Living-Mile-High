import path from 'path';
import fs from 'fs';
import { AssetService, CdnAdapter, AssetMetadata, CdnHead } from '~/@types';
import { AssetConfig, ContentCategory, ContentType } from '~/@types/constants';
import { createExpirationDate } from '~/utils/misc';

export class CdnAssetService implements AssetService {
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

        console.log(file);

        const metadata: AssetMetadata = {
            expiration: createExpirationDate(AssetConfig.RETENTION_DAYS)
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
            throw new Error(`Failed to upload asset: ${error.message}`);
        }
    }

    public async getExpiredAssets(keys: string[]): Promise<string[]> {
        const assets = await this.cdn.getHeads(keys);
        const expiredAssets = assets.filter(asset => this.isAssetExpired(asset));
        const expiredKeys = expiredAssets.map(asset => asset.key);
        return expiredKeys;
    }

    private isAssetExpired(asset: CdnHead): boolean {
        const expirationString = asset.metadata.expiration;
        return !expirationString || new Date(expirationString!) < new Date();
    }
}
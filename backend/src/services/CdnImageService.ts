import { ImageService, CdnAdapter } from '../types';
import { ImageCategory } from '../types/enums';

export class CdnImageService implements ImageService {
    private adapter: CdnAdapter;

    constructor(cdnService: CdnAdapter) {
        this.adapter = cdnService;
    }

    public async uploadImage(file: any, category: ImageCategory = ImageCategory.Houses): Promise<string> {
        const objectKey = this.adapter.generateUniqueKey(category);

        try {
            await this.adapter.putObject(objectKey, file.buffer, file.mimetype);
            return this.adapter.getObjectUrl(objectKey);
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}
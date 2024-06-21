import { ImageService, CdnService } from '../types';
import { ImageCategory } from '../types/enums';

export class CdnImageService implements ImageService {
    private cdnService: CdnService;

    constructor(cdnService: CdnService) {
        this.cdnService = cdnService;
    }

    public async uploadImage(file: any, category: ImageCategory = ImageCategory.Houses): Promise<string> {
        const objectKey = this.cdnService.generateUniqueKey(category);

        try {
            await this.cdnService.putObject(objectKey, file.buffer, file.mimetype);
            return this.cdnService.getObjectUrl(objectKey);
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}
import { ImageService, CdnAdapter } from '../../types';
import { ImageCategory } from '../../types/enums';

class CdnImageService implements ImageService {
    private cdn: CdnAdapter;

    constructor(cdn: CdnAdapter) {
        this.cdn = cdn;
    }

    public async uploadImage(file: any, category: ImageCategory = ImageCategory.Houses): Promise<string> {
        const objectKey = this.cdn.generateUniqueKey(category);

        try {
            await this.cdn.putObject(objectKey, file.buffer, file.mimetype);
            return this.cdn.getObjectUrl(objectKey);
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}

export default CdnImageService
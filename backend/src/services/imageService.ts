import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { DO_SPACE_BUCKET, DO_SPACE_KEY, DO_SPACE_SECRET, DO_SPACE_REGION } from '../env';

const minioClient = new Client({
    endPoint: `${DO_SPACE_REGION}.digitaloceanspaces.com`,
    port: 443,
    useSSL: true,
    accessKey: DO_SPACE_KEY,
    secretKey: DO_SPACE_SECRET
});

export class SpaceImageService {
    private bucketName = DO_SPACE_BUCKET; // Replace with your actual Space name

    public async uploadImage(file: Express.Multer.File): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        try {
            await minioClient.putObject(this.bucketName, fileName, file.buffer, undefined, {
                'Content-Type': file.mimetype,
                'x-amz-acl': 'public-read'
            });

            return `https://${this.bucketName}.nyc3.digitaloceanspaces.com/${fileName}`;
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    public async garbageCollect(referencedImages: string[]): Promise<void> {
        try {
            const allImages = await this.listAllImages();
            const referencedImagesSet = new Set(referencedImages);
            const imagesToDelete = allImages.filter(image => !referencedImagesSet.has(image));

            for (const image of imagesToDelete) {
                await this.deleteImage(image);
            }
        } catch (error: any) {
            throw new Error(`Failed to perform garbage collection: ${error.message}`);
        }
    }

    private async listAllImages(): Promise<string[]> {
        try {
            const stream = minioClient.listObjectsV2(this.bucketName, '', true);
            const allImages: string[] = [];

            return new Promise((resolve, reject) => {
                stream.on('data', obj => {
                    allImages.push(`https://${this.bucketName}.nyc3.digitaloceanspaces.com/${obj.name}`);
                });
                stream.on('end', () => resolve(allImages));
                stream.on('error', reject);
            });
        } catch (error: any) {
            throw new Error(`Failed to list images: ${error.message}`);
        }
    }

    private async deleteImage(imageUrl: string): Promise<void> {
        const imageKeyOptional = imageUrl.split('.com/').pop();

        try {
            const imageKey = imageKeyOptional!;
            await minioClient.removeObject(this.bucketName, imageKey);
        } catch (error: any) {
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }
}
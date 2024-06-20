import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

export type SpaceConfig = {
    region: string;
    bucket: string;
    key: string;
    secret: string;
}

export class SpaceImageService {
    private region: string;
    private bucket: string;
    private client: Client;

    constructor(config: SpaceConfig) {
        const { region, bucket, key, secret } = config;
        this.region = region;
        this.bucket = bucket;
        this.client = new Client({
            endPoint: `${region}.digitaloceanspaces.com`,
            port: 443,
            useSSL: true,
            accessKey: key,
            secretKey: secret
        });
    }

    public async uploadImage(file: any): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        try {
            await this.client.putObject(this.bucket, fileName, file.buffer, undefined, {
                'Content-Type': file.mimetype,
                'x-amz-acl': 'public-read'
            });

            return `https://${this.bucket}.${this.region}.cdn.digitaloceanspaces.com/${fileName}`;
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
            const stream = this.client.listObjectsV2(this.bucket, '', true);
            const allImages: string[] = [];

            return new Promise((resolve, reject) => {
                stream.on('data', obj => {
                    allImages.push(`https://${this.bucket}.${this.region}.cdn.digitaloceanspaces.com/${obj.name}`);
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
            await this.client.removeObject(this.bucket, imageKey);
        } catch (error: any) {
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }
}
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import HouseModel from '../models/houseModel'; // Ensure this path is correct based on your project structure
import { DO_SPACE_BUCKET, DO_SPACE_KEY, DO_SPACE_REGION, DO_SPACE_SECRET, DO_SPACE_URL } from '../env';

AWS.config.update({
    accessKeyId: DO_SPACE_KEY,
    secretAccessKey: DO_SPACE_SECRET,
    region: DO_SPACE_REGION, // e.g., 'nyc3'
    endpoint: DO_SPACE_URL, // e.g., 'https://nyc3.digitaloceanspaces.com'
}, true);

const s3 = new AWS.S3();

export class SpaceImageService {
    private bucketName = DO_SPACE_BUCKET;

    public async uploadImage(file: any): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const params = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ACL: 'public-read',
        };

        try {
            const data = await s3.upload(params).promise();
            return data.Location; // This is the URL of the uploaded image
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    public async garbageCollect(referencedImages: string[]): Promise<void> {
        try {
            const allImages = await this.listAllImages();
            const imagesToDelete = allImages.filter(image => !referencedImages.includes(image));

            for (const image of imagesToDelete) {
                await this.deleteImage(image);
            }
        } catch (error: any) {
            throw new Error(`Failed to perform garbage collection: ${error.message}`);
        }
    }

    private async listAllImages(): Promise<string[]> {
        const params = {
            Bucket: this.bucketName,
        };

        try {
            const data = await s3.listObjectsV2(params).promise();
            return data.Contents!.map((item: any) => `https://${this.bucketName}.${process.env.DO_REGION}.digitaloceanspaces.com/${item.Key}`);
        } catch (error: any) {
            throw new Error(`Failed to list images: ${error.message}`);
        }
    }

    private async deleteImage(imageUrl: string): Promise<void> {
        const imageKey = imageUrl.split('.com/').pop();

        const params = {
            Bucket: this.bucketName,
            Key: imageKey!,
        };
        try {
            await s3.deleteObject(params).promise();
        } catch (error: any) {
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }
}
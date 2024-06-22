import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, ListObjectsV2CommandOutput, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { CdnAdapter, S3CdnConfig } from '../../types';
import { CdnFixedKeys } from '../../types/enums';
import { v4 as uuidv4 } from 'uuid';

class S3CdnAdapter implements CdnAdapter {
    private client: S3Client;
    private bucket: string;
    private baseUrl: string;

    constructor(config: S3CdnConfig) {
        this.client = config.client;
        this.bucket = config.bucket;
        this.baseUrl = config.baseUrl
    }

    public getObjectUrl(objectKey: string): string {
        return `${this.baseUrl}/${objectKey}`;
    }

    public generateUniqueKey(prefix: string): string {
        return `${prefix}--${uuidv4()}`;
    }

    public async putObject(objectKey: string, body: any, contentType: string): Promise<boolean> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: objectKey,
                Body: body,
                ContentType: contentType,
                ACL: 'public-read',
            });
            await this.client.send(command);
            return true;
        } catch (error: any) {
            // console.error(`Failed to upload object: ${error.message}`);
            return false;
        }
    }

    public async getObject(objectKey: string): Promise<GetObjectCommandOutput> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
        });
        return await this.client.send(command);
    }

    public async deleteObject(objectKey: string): Promise<boolean> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: objectKey,
            });
            await this.client.send(command);
            return true;
        } catch (error: any) {
            return false;
        }
    }

    public async uploadImage(file: any, prefix: string): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const objectKey = `${prefix}-${uuidv4()}.${fileExtension}`;

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: objectKey,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            });
            await this.client.send(command);

            return objectKey;
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    public async garbageCollect(references: object): Promise<number> {
        const referencedKeys = this.extractCdnKeys(references);
        const allKeys = await this.getAllKeys();
        const fixedKeysSet = new Set<string>(Object.values(CdnFixedKeys));
        const referencedKeysSet = new Set(referencedKeys);

        const keysToDelete = allKeys.filter(key => {
            return !fixedKeysSet.has(key) && !referencedKeysSet.has(key);
        });

        const success = await Promise.all(keysToDelete.map(key => this.deleteObject(key)));

        if (!success) {
            throw new Error('Failed to delete objects');
        }

        return keysToDelete.length;
    }

    private extractCdnKeys(references: object): string[] {
        const keys: string[] = [];

        const traverse = (obj: any) => {
            if (typeof obj === 'string' && obj.includes(this.baseUrl)) {
                const key = new URL(obj).pathname.substring(1); // Extract the key from the URL
                keys.push(key);
            } else if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        traverse(obj[key]);
                    }
                }
            }
        };

        traverse(references);
        return keys;
    }

    private async getAllKeys(): Promise<string[]> {
        const allKeys: string[] = [];
        let isTruncated = true;
        let continuationToken: string | undefined = undefined;

        while (isTruncated) {
            try {
                const command = new ListObjectsV2Command({
                    Bucket: this.bucket,
                    ContinuationToken: continuationToken,
                });
                const response: ListObjectsV2CommandOutput = await this.client.send(command);

                const newKeys = response.Contents?.map((item) => item.Key!) || [];
                allKeys.push(...newKeys);

                isTruncated = response.IsTruncated || false;
                continuationToken = response.NextContinuationToken;
            } catch (error: any) {
                throw new Error(`Failed to list objects: ${error.message}`);
            }
        }

        return allKeys;
    }
}

export default S3CdnAdapter
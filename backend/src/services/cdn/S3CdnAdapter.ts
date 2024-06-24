import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, ListObjectsV2CommandOutput, GetObjectCommand, GetObjectCommandOutput, CopyObjectCommand } from "@aws-sdk/client-s3";
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

    public getObjectUrl(key: string): string {
        return `${this.baseUrl}/${key}`;
    }

    public generateUniqueKey(prefix: string): string {
        return `${prefix}--${uuidv4()}`;
    }

    private async tryCommand<T>(command: any): Promise<boolean> {
        try {
            await this.client.send(command);
            return true;
        } catch (error: any) {
            return false;
        }
    }

    public async putObject(key: string, body: any, contentType: string): Promise<boolean> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
            ACL: 'public-read',
        });
        return await this.tryCommand(command);
    }

    public async getObject(key: string): Promise<GetObjectCommandOutput> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        return await this.client.send(command);
    }

    public async moveObject(sourceKey: string, destinationKey: string): Promise<boolean> {
        const command = new CopyObjectCommand({
            Bucket: this.bucket,
            CopySource: `${this.bucket}/${sourceKey}`,
            Key: destinationKey,
            ACL: 'public-read'
        });
        return await this.tryCommand(command);
    }

    public async deleteObject(key: string): Promise<boolean> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        return await this.tryCommand(command);
    }

    public extractKeys(data: any): string[] {
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

        traverse(data);
        return keys;
    }

    public async getAllKeys(): Promise<string[]> {
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
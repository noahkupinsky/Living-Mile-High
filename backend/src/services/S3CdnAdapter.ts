import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    GetObjectCommand,
    GetObjectCommandOutput,
    CopyObjectCommand,
    CopyObjectCommandOutput,
    DeleteObjectCommandOutput,
    PutObjectCommandOutput
} from "@aws-sdk/client-s3";
import { CdnAdapter, S3Config } from '~/@types';
import { ContentPrefix } from "~/@types/constants";
import { prefixKey } from "~/utils/misc";

function generateAlphanumericKey(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export class S3CdnAdapter implements CdnAdapter {
    private client: S3Client;
    private bucket: string;
    private baseUrl: string;

    constructor(config: S3Config) {
        this.client = config.client;
        this.bucket = config.bucket;
        this.baseUrl = config.baseUrl
    }

    public getObjectUrl(key: string): string {
        return `${this.baseUrl}/${key}`;
    }

    public generateUniqueKey(): string {
        return generateAlphanumericKey();
    }

    public async putObject(key: string, body: any, contentType: string, prefix?: ContentPrefix): Promise<PutObjectCommandOutput> {
        const prefixedKey = prefixKey(key, prefix);

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: prefixedKey,
            Body: body,
            ContentType: contentType,
            ACL: 'public-read',
        });
        return await this.client.send(command);
    }

    public async getObject(key: string): Promise<GetObjectCommandOutput> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        return await this.client.send(command);
    }

    public async moveObject(sourceKey: string, destinationKey: string): Promise<CopyObjectCommandOutput> {
        const command = new CopyObjectCommand({
            Bucket: this.bucket,
            CopySource: `${this.bucket}/${sourceKey}`,
            Key: destinationKey,
            ACL: 'public-read'
        });
        return await this.client.send(command);
    }

    public async deleteObject(key: string): Promise<DeleteObjectCommandOutput> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        return await this.client.send(command);
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

    public async getKeys(prefix?: ContentPrefix): Promise<string[]> {
        const allKeys: string[] = [];
        let isTruncated = true;
        let continuationToken: string | undefined = undefined;

        while (isTruncated) {
            try {
                const command = new ListObjectsV2Command({
                    Bucket: this.bucket,
                    ContinuationToken: continuationToken,
                    Prefix: prefix,
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
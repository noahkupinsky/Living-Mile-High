import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    CopyObjectCommand,
    CopyObjectCommandOutput,
    DeleteObjectCommandOutput,
    PutObjectCommandOutput,
    GetObjectCommand,
    GetObjectCommandOutput
} from "@aws-sdk/client-s3";
import { CdnAdapter, CdnMetadata, GetCommandOutput, PutCommand, S3Config } from '~/@types';
import { ContentPrefix, ContentType } from "~/@types/constants";
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

    public async putObject(command: PutCommand): Promise<string> {
        const { key, body, contentType, prefix, metadata: optionalMetadata } = command;

        const metadata: CdnMetadata = optionalMetadata || {};

        const prefixedKey = prefixKey(key, prefix);

        const putObjectCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Metadata: metadata,
            Key: prefixedKey,
            Body: body,
            ContentType: contentType,
            ACL: 'public-read',
        });
        await this.client.send(putObjectCommand);

        return prefixedKey;
    }

    public async deleteObject(key: string): Promise<DeleteObjectCommandOutput> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        return await this.client.send(command);
    }

    public async deleteObjects(keys: string[]): Promise<DeleteObjectCommandOutput[]> {
        const deleteObjectPromises = keys.map(async (key) => {
            return this.deleteObject(key);
        });

        return await Promise.all(deleteObjectPromises);
    }

    public extractKeys(data: any): string[] {
        const keys: string[] = [];
        const urlPattern = new RegExp(`${this.baseUrl}/([^/]+)`);

        const traverse = (obj: any) => {
            if (typeof obj === 'string') {
                const match = obj.match(urlPattern);
                if (match && match[1]) {
                    keys.push(match[1]);
                }
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

    public async getObject(key: string): Promise<GetCommandOutput> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            });
            const response: GetObjectCommandOutput = await this.client.send(command);

            const body = response.Body!;
            const metadata = response.Metadata!;
            const contentType = response.ContentType! as ContentType;

            return {
                key,
                body,
                contentType,
                metadata
            };
        } catch (error: any) {
            throw new Error(`Failed to get object ${key}: ${error.message}`);
        }
    }

    public async getObjects(keys: string[]): Promise<GetCommandOutput[]> {
        const getObjectPromises = keys.map(async (key) => {
            return this.getObject(key);
        });

        return await Promise.all(getObjectPromises);
    }
}
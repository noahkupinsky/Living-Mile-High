import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    GetObjectCommand,
    GetObjectCommandOutput,
    HeadObjectCommand,
    HeadObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { CdnFixedKey } from "living-mile-high-lib";
import { Readable } from "stream";
import { CdnAdapter, CdnMetadata, CdnContent, PutCommand, S3Config, CdnHead, RefreshCdnCache } from '~/@types';
import { ContentCategory, ContentPermission, ContentType } from "~/@types/constants";
import withLock from "~/utils/locks";
import { prefixKey, convertToS3Metadata, convertFromS3Metadata } from "~/utils/misc";

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
    private customRefreshCache?: RefreshCdnCache;

    constructor(config: S3Config) {
        this.client = config.client;
        this.bucket = config.bucket;
        this.baseUrl = config.baseUrl;
        this.customRefreshCache = config.refreshCache;
    }

    public getObjectUrl(key: string): string {
        return `${this.baseUrl}/${key}`;
    }

    public generateUniqueKey(): string {
        return generateAlphanumericKey();
    }

    public async putObject(command: PutCommand): Promise<string> {
        const { key, body, contentType, prefix, permission: optionalPermission, metadata: optionalMetadata } = command;

        const metadata: CdnMetadata = optionalMetadata || {};
        const permission = optionalPermission || this.inferPermission(key, prefix);

        const prefixedKey = prefixKey(key, prefix);
        const s3Metadata = convertToS3Metadata(metadata);

        const putObjectCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Metadata: s3Metadata,
            Key: prefixedKey,
            Body: body,
            ContentType: contentType,
            ACL: permission,
        });

        await withLock(prefixedKey, async () => {
            await this.send(putObjectCommand);
        });

        return prefixedKey;
    }

    private inferPermission(key: string, prefix?: ContentCategory): ContentPermission {
        const isAsset = prefix === ContentCategory.ASSET;
        const fixedKeys: string[] = Object.values(CdnFixedKey);
        const isFixedKey = prefix === undefined && fixedKeys.includes(key);
        const isPublic = isAsset || isFixedKey;
        return isPublic ? ContentPermission.PUBLIC : ContentPermission.PRIVATE
    }

    public async deleteObject(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        await withLock(key, async () => {
            await this.send(command);
        })
    }

    public async deleteObjects(keys: string[]): Promise<void> {
        const deleteObjectPromises = keys.map(async (key) => {
            return this.deleteObject(key);
        });

        await Promise.all(deleteObjectPromises);
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

    public async getKeys(prefix?: ContentCategory): Promise<string[]> {
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
                const response: ListObjectsV2CommandOutput = await this.send(command);

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

    public async getHead(key: string): Promise<CdnHead> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            const response: HeadObjectCommandOutput = await this.send(command);

            const s3Metadata = response.Metadata || {};
            const metadata = convertFromS3Metadata(s3Metadata);
            const contentType = response.ContentType! as ContentType;

            return {
                key,
                metadata,
                contentType,
            };
        } catch (error: any) {
            throw new Error(`Failed to get metadata for object ${key}: ${error.message}`);
        }
    }

    public async getHeads(keys: string[]): Promise<CdnHead[]> {
        const getHeadPromises = keys.map(key => this.getHead(key));
        return await Promise.all(getHeadPromises);
    }

    public async getObject(key: string): Promise<CdnContent> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            });
            const response: GetObjectCommandOutput = await this.send(command);

            const body = response.Body!;
            const s3Metadata = response.Metadata!;
            const contentType = response.ContentType! as ContentType;
            const metadata = convertFromS3Metadata(s3Metadata);

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

    public async getObjects(keys: string[]): Promise<CdnContent[]> {
        const getObjectPromises = keys.map(async (key) => {
            return this.getObject(key);
        });

        return await Promise.all(getObjectPromises);
    }

    public async updateObjectMetadata(key: string, updates: Partial<CdnMetadata>): Promise<void> {
        const existingObject = await this.getObject(key);
        const bodyStream = existingObject.body as Readable;
        const metadata = { ...existingObject.metadata, ...updates };

        const s3Metadata = convertToS3Metadata(metadata);

        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: bodyStream,
                Metadata: s3Metadata
            }
        });

        await withLock(key, async () => {
            try {
                await upload.done();
            } catch (error: any) {
                throw new Error(`Failed to update object ${key}: ${error.message}`);
            }
        });
    }

    private async send(command: any): Promise<any> {
        const response = await this.client.send(command);
        return response;
    }

    public async refreshCache(): Promise<void> {
        if (this.customRefreshCache) {
            await this.customRefreshCache();
        }
    }
}
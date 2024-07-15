import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    CopyObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    MetadataDirective
} from "@aws-sdk/client-s3";
import { CdnFixedKey } from "living-mile-high-lib";
import { CdnAdapter, CdnMetadata, CdnContent, PutCommand, S3Config } from '~/@types';
import { ContentCategory, ContentPermission, ContentType } from "~/@types/constants";
import { prefixKey, prefixMetadata, unprefixMetadata } from "~/utils/misc";

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
        const { key, body, contentType, prefix, permission: optionalPermission, metadata: optionalMetadata } = command;

        const metadata: CdnMetadata = optionalMetadata || {};
        const permission = optionalPermission || this.inferPermission(key, prefix);

        const prefixedKey = prefixKey(key, prefix);
        const prefixedMetadata = prefixMetadata(metadata);

        const putObjectCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Metadata: prefixedMetadata,
            Key: prefixedKey,
            Body: body,
            ContentType: contentType,
            ACL: permission,
        });
        await this.client.send(putObjectCommand);

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
        await this.client.send(command);
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

    public async getObject(key: string): Promise<CdnContent> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            });
            const response: GetObjectCommandOutput = await this.client.send(command);

            const body = response.Body!;
            const prefixedMetadata = response.Metadata!;
            const contentType = response.ContentType! as ContentType;
            const metadata = unprefixMetadata(prefixedMetadata);

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
        const metadata = { ...existingObject.metadata, ...updates };

        const prefixedMetadata = prefixMetadata(metadata);

        const command = new CopyObjectCommand({
            Bucket: this.bucket,
            CopySource: this.getObjectUrl(key),
            Key: key,
            Metadata: prefixedMetadata,
            MetadataDirective: MetadataDirective.REPLACE
        });
        await this.client.send(command);
    }
}
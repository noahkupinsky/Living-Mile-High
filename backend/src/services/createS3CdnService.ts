import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, GetObjectCommandOutput, GetObjectRequest } from "@aws-sdk/client-s3";
import { S3CdnServiceConfig } from './S3CdnService';

export const inMemoryCDN: { [key: string]: { body: any, contentType: string } } = {};

export class InMemoryS3Client {
    public async send(command: any): Promise<any> {
        if (command instanceof PutObjectCommand) {
            const params = command.input;
            inMemoryCDN[params.Key!] = { body: params.Body, contentType: params.ContentType! };
            return {};
        } else if (command instanceof DeleteObjectCommand) {
            const params = command.input;
            delete inMemoryCDN[params.Key!];
            return {};
        } else if (command instanceof GetObjectCommand) {
            const params = command.input;
            if (inMemoryCDN[params.Key!]) {
                return { Body: inMemoryCDN[params.Key!].body } as GetObjectCommandOutput;
            } else {
                throw new Error('Object not found');
            }
        } else if (command instanceof ListObjectsV2Command) {
            const params = command.input;
            const keys = Object.keys(inMemoryCDN).filter(key => key.startsWith(params.Prefix || ""));
            return {
                Contents: keys.map(key => ({ Key: key })),
                IsTruncated: false,
            };
        } else {
            throw new Error(`Unsupported command: ${command.constructor.name}`);
        }
    }

    public async getObject(params: GetObjectRequest): Promise<GetObjectCommandOutput> {
        if (inMemoryCDN[params.Key!]) {
            return { Body: inMemoryCDN[params.Key!].body } as GetObjectCommandOutput;
        } else {
            throw new Error('Object not found');
        }
    }
}

export function createInMemoryS3CdnServiceConfig(): S3CdnServiceConfig {
    const mockClient = new InMemoryS3Client() as unknown as S3Client;
    return {
        client: mockClient,
        bucket: 'mock-bucket',
    };
}

export function createDOSpaceS3CdnServiceConfig(
    region: string,
    bucket: string,
    key: string,
    secret: string
): S3CdnServiceConfig {
    const client = new S3Client({
        endpoint: `https://${region}.digitaloceanspaces.com`,
        credentials: {
            accessKeyId: key,
            secretAccessKey: secret,
        },
        region: region,
        forcePathStyle: true, // needed for spaces endpoint compatibility
    });

    return { client, bucket };
}
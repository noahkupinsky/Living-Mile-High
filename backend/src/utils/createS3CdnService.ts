import { S3Client } from "@aws-sdk/client-s3";
import { S3Config } from "~/@types";
import { mockS3Cdn } from "./inMemoryCdn";

function generateBaseUrl(endpoint: string, bucket: string, region: string): string {
    if (endpoint.includes('digitaloceanspaces.com')) {
        return `https://${bucket}.${region}.cdn.digitaloceanspaces.com`;
    } else if (endpoint.includes('localhost') || endpoint.includes('minio')) {
        return `${endpoint}/${bucket}`;
    } else {
        throw new Error("failed to construct base url");
    }
}

export async function createInMemoryS3CdnConfig(): Promise<S3Config> {
    mockS3Cdn();

    const client = new S3Client({});

    const bucket = 'mock-bucket';

    const baseUrl = generateBaseUrl('http://localhost', bucket, 'us-east-1');

    return { client, bucket, baseUrl };
}

export type CreateCdnParams = {
    endpoint: string,
    region: string,
    bucket: string,
    key: string,
    secret: string
}

export function createNetworkS3CdnConfig(params: CreateCdnParams): S3Config {
    const { endpoint, region, bucket, key, secret } = params;
    const client = new S3Client({
        endpoint: endpoint,
        credentials: {
            accessKeyId: key,
            secretAccessKey: secret,
        },
        region: region,
        forcePathStyle: true, // needed for spaces endpoint compatibility
    });

    const baseUrl = generateBaseUrl(endpoint, bucket, region);

    return { client, bucket, baseUrl };
}
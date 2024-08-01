import { S3Client } from "@aws-sdk/client-s3";
import { S3Config } from "~/@types";
import { mockS3Cdn } from "./inMemoryCdn";

export async function createInMemoryS3CdnConfig(): Promise<S3Config> {
    mockS3Cdn();

    const client = new S3Client({});

    const bucket = 'mock-bucket';

    const baseUrl = 'http://mock-bucket.s3.us-east-1.amazonaws.com';

    return { client, bucket, baseUrl };
}

export type CreateCdnParams = {
    endpoint: string,
    region: string,
    bucket: string,
    key: string,
    secret: string,
    baseUrl: string,
}

export function createNetworkS3CdnConfig(params: CreateCdnParams): S3Config {
    const { endpoint, region, bucket, key, secret, baseUrl } = params;
    const client = new S3Client({
        endpoint: endpoint,
        credentials: {
            accessKeyId: key,
            secretAccessKey: secret,
        },
        region: region,
        forcePathStyle: true, // needed for spaces endpoint compatibility
    });

    return { client, bucket, baseUrl };
}
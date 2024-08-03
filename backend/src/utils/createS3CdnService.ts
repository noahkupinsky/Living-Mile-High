import { S3Client } from "@aws-sdk/client-s3";
import { RefreshCdnCache, S3Config } from "~/@types";
import { mockS3Cdn } from "./inMemoryCdn";
import axios from "axios";

export async function createInMemoryS3CdnConfig(): Promise<S3Config> {
    mockS3Cdn();

    const client = new S3Client({});

    const bucket = 'mock-bucket';

    const baseUrl = 'http://mock-bucket.s3.us-east-1.amazonaws.com';

    return { client, bucket, baseUrl };
}

export type CreateDOCdnParams = {
    endpoint: string,
    region: string,
    bucket: string,
    key: string,
    secret: string,
    baseUrl: string,
    refreshCache?: RefreshCdnCache
}

export function createDOS3CdnConfig(params: CreateDOCdnParams): S3Config {
    const { endpoint, region, bucket, key, secret, baseUrl, refreshCache } = params;
    const client = new S3Client({
        endpoint: endpoint,
        credentials: {
            accessKeyId: key,
            secretAccessKey: secret,
        },
        region: region,
        forcePathStyle: true, // needed for spaces endpoint compatibility
    });

    return { client, bucket, baseUrl, refreshCache };
}
export function createDORefreshCacheFn(apiToken: string, endpointId: string) {
    return async (key: string) => {
        const apiUrl = `https://api.digitalocean.com/v2/cdn/endpoints/${endpointId}/cache`;
        try {
            const response = await axios.delete(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    files: [key]
                }
            });
            console.log(`Cache refreshed for key: ${key}`, response.data);
        } catch (error: any) {
            console.error(`Failed to refresh cache for key: ${key}`, error);
        }
    }
}
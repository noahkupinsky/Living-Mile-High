import { S3Client } from "@aws-sdk/client-s3";
import { RefreshCdnCache, S3Config } from "~/@types";
import { mockS3Cdn } from "./inMemoryCdn";
import axios from "axios";
import { limitFrequency } from "./locks";
import { REFRESH_CDN_CACHE_MAX_FREQUENCY } from "~/@types/constants";

export async function createInMemoryS3CdnConfig(): Promise<S3Config> {
    mockS3Cdn();

    const client = new S3Client({ region: 'sfo3', });

    const bucket = 'mock-bucket';

    const baseUrl = 'http://mock-bucket.s3.us-east-1.amazonaws.com';

    return { client, bucket, baseUrl };
}

export type CreateS3ConfigParams = {
    endpoint: string,
    region: string,
    bucket: string,
    key: string,
    secret: string,
    baseUrl: string,
    refreshCache?: RefreshCdnCache,
}

export function createS3Config(params: CreateS3ConfigParams): S3Config {
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

export function createDORefreshCdnCache(apiToken: string, endpointId: string): RefreshCdnCache {
    const refreshCacheImmediately = async (keys?: string[]) => {
        const apiUrl = `https://api.digitalocean.com/v2/cdn/endpoints/${endpointId}/cache`;
        try {
            await axios.delete(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    files: (keys || ['*'])
                }
            });
        } catch (error: any) {
            console.error(`Failed to refresh cache`, error);
        }
    }

    return limitFrequency(refreshCacheImmediately, REFRESH_CDN_CACHE_MAX_FREQUENCY);
}
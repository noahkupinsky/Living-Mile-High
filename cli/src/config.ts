import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
    cdnEndpoint: process.env.ENV_CDN_ENDPOINT,
    cdnKey: process.env.ENV_CDN_KEY,
    cdnSecret: process.env.ENV_CDN_SECRET,
    cdnRegion: process.env.ENV_CDN_REGION,
    cdnBucket: process.env.ENV_CDN_BUCKET,
    minio: process.env.MINIO,
};
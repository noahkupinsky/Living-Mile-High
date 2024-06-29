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
    composeBuildFile: 'docker-compose.build.yml',
    composeProdFile: 'docker-compose.prod.yml',
    composeStagingFile: 'docker-compose.staging.yml',
    composeDevServicesFile: 'docker-compose.dev-services.yml',
    composeStagingServicesFile: 'docker-compose.staging-services.yml',
    nonProdVolumes: ['minio_data_dev', 'minio_data_staging', 'mongo_data_dev', 'mongo_data_staging'],
};
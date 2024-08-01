import dotenv from 'dotenv';
import path from 'path';
import { joinRoot } from './utils/envUtils';

dotenv.config({ path: joinRoot('.env') });

export class Compose {
    #composeFile: string;
    #envFile: string;

    constructor(composeFile: string, envFile: string) {
        this.#composeFile = composeFile;
        this.#envFile = envFile;
    }

    get composeFile() {
        return joinRoot(this.#composeFile);
    }

    get envFile() {
        return joinRoot(`.env.${this.#envFile}`);
    }
}

type ComposeNames = 'superadmin' | 'prod' | 'staging' | 'devServices' | 'stagingServices';

const composes: Record<ComposeNames, Compose> = {
    superadmin: new Compose('docker-compose.prod-superadmin.yml', 'production'),
    prod: new Compose('docker-compose.prod.yml', 'production'),
    staging: new Compose('docker-compose.staging.yml', 'staging'),
    devServices: new Compose('docker-compose.dev-services.yml', 'development'),
    stagingServices: new Compose('docker-compose.staging-services.yml', 'staging'),
}

export const config = {
    composes: composes,
    nonProdVolumes: ['minio_data_dev', 'minio_data_staging', 'mongo_data_dev', 'mongo_data_staging'],
};
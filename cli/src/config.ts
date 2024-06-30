import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export class Compose {
    #composeFile: string;
    #envFile: string;

    constructor(composeFile: string, envFile: string) {
        this.#composeFile = composeFile;
        this.#envFile = envFile;
    }

    get composeFile() {
        return path.resolve(process.cwd(), this.#composeFile);
    }

    get envFile() {
        return path.resolve(process.cwd(), `.env.${this.#envFile}`);
    }
}

const composes: Record<string, Compose> = {
    build: new Compose('docker-compose.build.yml', 'production'),
    prod: new Compose('docker-compose.prod.yml', 'production'),
    staging: new Compose('docker-compose.staging.yml', 'staging'),
    devServices: new Compose('docker-compose.dev-services.yml', 'development'),
    stagingServices: new Compose('docker-compose.staging-services.yml', 'staging'),
}

export const config = {
    composes: composes,
    nonProdVolumes: ['minio_data_dev', 'minio_data_staging', 'mongo_data_dev', 'mongo_data_staging'],
};
import path from 'path';

export const ROOT_RELATIVE = '../../..'; // relative to package directory

export const joinRoot = (rest: string) => {
    return path.resolve(__dirname, ROOT_RELATIVE, rest);
}

export const ROOT_PATH = joinRoot('');

export const joinEnv = (env: string) => {
    return joinRoot(`.env.${env}`);
}

export const joinCompose = (composeFile: string) => {
    return joinRoot(`config/${composeFile}`);
}

export class Compose {
    #composeFile: string;
    #envFile: string;

    constructor(composeFile: string, envFile: string) {
        this.#composeFile = composeFile;
        this.#envFile = envFile;
    }

    get composeFile() {
        return joinCompose(this.#composeFile);
    }

    get envFile() {
        return joinEnv(this.#envFile);
    }
}

type ComposeName = 'prod' | 'staging' | 'devServices' | 'stagingServices' | 'prodBuild' | 'prodServices';

const composes: { [key in ComposeName]: Compose } = {
    prod: new Compose('docker-compose.prod.yml', 'production'),
    prodBuild: new Compose('docker-compose.prod-build.yml', 'production'),
    prodServices: new Compose('docker-compose.prod-services.yml', 'production'),
    staging: new Compose('docker-compose.staging.yml', 'staging'),
    stagingServices: new Compose('docker-compose.staging-services.yml', 'staging'),
    devServices: new Compose('docker-compose.dev-services.yml', 'development'),
}

export const config = {
    composes: composes,
    nonProdVolumes: ['minio_data_dev', 'minio_data_staging', 'mongo_data_dev', 'mongo_data_staging'],
};
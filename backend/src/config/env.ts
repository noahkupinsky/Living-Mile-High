import dotenv from 'dotenv';
import path from 'path';

type Env = {
    MOCK: string,
    MONGODB_URI: string,
    JWT_SECRET: string,
    BPORT: string,
    CDN_KEY: string,
    CDN_SECRET: string,
    CDN_REGION: string,
    CDN_BUCKET: string,
    CDN_ENDPOINT: string
}

const EnvDefaults: Env = {
    MOCK: '',
    MONGODB_URI: '',
    JWT_SECRET: 'jwtsecret',
    BPORT: '3001',
    CDN_KEY: '',
    CDN_SECRET: '',
    CDN_REGION: '',
    CDN_BUCKET: '',
    CDN_ENDPOINT: '',
}

const allowedEnvFiles = ['staging', 'development', 'production'];

const envFile = process.env.ENV_FILE;

if (envFile && allowedEnvFiles.includes(envFile)) {
    // Project root dir is three folders back
    const envPath = path.resolve(__dirname, `../../../.env.${envFile}`);
    dotenv.config({ path: envPath });
}

const env = (): Env => {
    return {
        ...EnvDefaults,
        ...process.env
    }
};

export default env
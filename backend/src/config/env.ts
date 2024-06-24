import dotenv from 'dotenv';
import path from 'path';

const allowedEnvFiles = ['staging', 'development', 'production'];

const envFile = process.env.ENV_FILE;

if (envFile && allowedEnvFiles.includes(envFile)) {
    // Project root dir is three folders back
    const envPath = path.resolve(__dirname, `../../../.env.${envFile}`);
    dotenv.config({ path: envPath });
}

type Env =
    'SERVICES' |
    'MONGODB_ATLAS_URI' |
    'JWT_SECRET' |
    'BACKEND_PORT' |
    'CDN_KEY' |
    'CDN_SECRET' |
    'CDN_REGION' |
    'CDN_BUCKET' |
    'CDN_ENDPOINT'

const env = (key: Env) => {
    return process.env[key] || '';
};

export default env
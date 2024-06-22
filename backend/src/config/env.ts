import dotenv from 'dotenv';
import path from 'path';

const allowedEnvFiles = ['local', 'development', 'production'];

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
    'DO_SPACE_KEY' |
    'DO_SPACE_SECRET' |
    'DO_SPACE_REGION' |
    'DO_SPACE_BUCKET'

const env = (key: Env) => {
    return process.env[key] || '';
};

export default env
import dotenv from 'dotenv';
import path from 'path';

type Env = {
    MONGODB_URI?: string,
    JWT_SECRET: string,
    BPORT: string,
    CDN_KEY?: string,
    CDN_SECRET?: string,
    CDN_REGION?: string,
    CDN_BUCKET?: string,
    CDN_ENDPOINT?: string,
    NEXT_PUBLIC_CDN_URL?: string,
    DO_ENDPOINT_ID?: string,
    DO_API_TOKEN?: string,
    SENDGRID_API_KEY?: string,
    SENDGRID_SENDER?: string,
    CONTACT_TO_EMAIL_ADDRESS?: string,
    PROD: string
}

const EnvDefaults: Env = {
    JWT_SECRET: 'jwtsecret',
    BPORT: '3001',
    PROD: 'false',
}

const allowedEnvFiles = ['staging', 'development', 'production'];

const envFile = process.env.ENV_FILE;

const projectRootRelative = '../../..'

const projectRoot = path.join(__dirname, projectRootRelative);

if (envFile && allowedEnvFiles.includes(envFile)) {
    const envPath = path.join(projectRoot, `.env.${envFile}`);
    dotenv.config({ path: envPath });
}

const env = (): Env => {
    return {
        ...EnvDefaults,
        ...process.env
    }
};

export default env
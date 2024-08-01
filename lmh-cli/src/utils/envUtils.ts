import { S3Client, GetObjectCommand, PutObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import dotenv from 'dotenv';

const ROOT_PATH = '..';

export const resolveRoot = (rest: string) => {
    return path.resolve(ROOT_PATH, rest);
}

export const loadEnvFile = (envFile: string) => {
    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    return envConfig;
};

const prodEnvFile = resolveRoot('.env.production');
const { CDN_BUCKET, CDN_ENDPOINT, CDN_KEY, CDN_SECRET, CDN_REGION } = loadEnvFile(prodEnvFile);

console.log(CDN_BUCKET, CDN_ENDPOINT, CDN_KEY, CDN_SECRET, CDN_REGION);

const cdnClient = new S3Client({
    endpoint: CDN_ENDPOINT,
    credentials: {
        accessKeyId: CDN_KEY,
        secretAccessKey: CDN_SECRET,
    },
    region: CDN_REGION,
    forcePathStyle: true,
});

async function streamToFile(stream: Readable, filePath: string) {
    return new Promise<void>((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        stream.pipe(fileStream);
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}

export async function pullEnv(env: string, doForce: boolean) {
    const targetPath = resolveRoot(env);

    if (fs.existsSync(targetPath) && !doForce) {
        console.log(`File ${env} already exists in the root directory. Use -f to overwrite.`);
        return;
    }

    try {
        const command = new GetObjectCommand({
            Bucket: CDN_BUCKET,
            Key: env,
        });
        const response: GetObjectCommandOutput = await cdnClient.send(command);

        if (response.Body instanceof Readable) {
            await streamToFile(response.Body, targetPath);
            console.log(`Environment variables for ${env} fetched successfully.`);
        } else {
            console.error('Response body is not a readable stream.');
        }
    } catch (err) {
        console.error(`Failed to fetch environment variables for ${env}:`, err);
    }
}

export async function pushEnv(env: string) {
    const targetPath = resolveRoot(env);

    if (!fs.existsSync(targetPath)) {
        console.log(`File ${env} does not exist in the root directory.`);
        return;
    }

    try {
        const fileContent = fs.readFileSync(targetPath);
        const command = new PutObjectCommand({
            Bucket: CDN_BUCKET,
            Key: env,
            Body: fileContent,
        });

        await cdnClient.send(command);
        console.log(`Environment variables for ${env} pushed successfully.`);
    } catch (err) {
        console.error(`Failed to push environment variables for ${env}:`, err);
    }
}
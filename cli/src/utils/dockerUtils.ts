import { CreateBucketCommand, ListBucketsCommand, ListBucketsCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function dockerBuild() {
    console.log('Building Docker images...');
    execSync('docker compose -f docker-compose.build.yml build', { stdio: 'inherit' });
}

export function dockerRun(composeFile: string) {
    dockerDown(composeFile);
    console.log(`Starting Docker containers using ${composeFile}...`);
    execSync(`docker compose -f ${composeFile} up --build -d`, { stdio: 'inherit' });
}

export function dockerDown(composeFile: string) {
    console.log(`Shutting down Docker containers using ${composeFile}...`);
    execSync(`docker compose -f ${composeFile} down`, { stdio: 'inherit' });
}

export function dockerDownAll() {
    console.log('Shutting down all Docker containers...');
    const files = [
        'docker-compose.build.yml',
        'docker-compose.prod.yml',
        'docker-compose.staging.yml',
        'docker-compose.dev-services.yml',
        'docker-compose.setup-services.yml',
    ];
    files.forEach(file => dockerDown(file));
}

export function dockerCleanup(images: string[]) {
    console.log('Cleaning up Docker images...');
    execSync(`docker rmi ${images.join(' ')}`, { stdio: 'inherit' });
}

export async function resetServices() {
    resetDataDir();
    dockerDownAll();
    execSync(`docker compose -f docker-compose.setup-services.yml up --build -d`, { stdio: 'inherit' });
    await Promise.all([9000, 9001].map(p => createBucket(p)));
    dockerDown('docker-compose.setup-services.yml');
}

function resetDataDir() {
    if (fs.existsSync(path.resolve(process.cwd(), '.data'))) {
        throw new Error('Data directory already exists. Please remove it before running this command.');
    }

    const data_services = ['mongo', 'minio'];
    const data_categories = ['development', 'production', 'staging'];

    const data_dirs = data_services.map(s => data_categories.map(c => `.data/${s}/${c}`)).flat();

    data_dirs.forEach(dir => fs.mkdirSync(path.resolve(process.cwd(), dir), { recursive: true }));
}

async function createBucket(port: number) {
    try {
        const client = new S3Client({
            endpoint: `http://localhost:${port}`,
            region: 'sfo3',
            credentials: {
                accessKeyId: process.env.MINIO as string,
                secretAccessKey: process.env.MINIO as string,
            },
            forcePathStyle: true,
        });

        const buckets: ListBucketsCommandOutput = await client.send(new ListBucketsCommand({}));
        const bucketExists = buckets.Buckets?.some(bucket => bucket.Name === process.env.MINIO);

        if (!bucketExists) {
            const createBucketParams = { Bucket: process.env.MINIO as string };
            await client.send(new CreateBucketCommand(createBucketParams));
            console.log(`Bucket created: ${process.env.MINIO}`);
        } else {
            console.log(`Bucket already exists: ${process.env.MINIO}`);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}
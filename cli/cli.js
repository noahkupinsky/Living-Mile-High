#!/usr/bin/env node

const { S3Client, GetObjectCommand, PutObjectCommand, ListBucketsCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
const { execSync } = require('child_process');
const { program } = require('commander');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');

require('dotenv').config({ path: envPath });

const { CDN_ENDPOINT, CDN_KEY, CDN_SECRET, CDN_REGION, CDN_BUCKET, MINIO } = process.env;

const dockerCleanup = (images) => {
    console.log('Cleaning up Docker containers and images...');
    execSync(`docker rmi ${images.join(' ')}`, { stdio: 'inherit' });
};

const dockerDown = (composeFile) => {
    console.log(`Shutting down Docker containers using ${composeFile}...`);
    execSync(`docker compose -f ${composeFile} down`, { stdio: 'inherit' });
};

const dockerDownAll = () => {
    dockerDown('docker-compose.build.yml');
    dockerDown('docker-compose.prod.yml');
    dockerDown('docker-compose.staging.yml');
    dockerDown('docker-compose.services.yml');
    dockerDown('docker-compose.setup-services.yml');
}

const dockerBuild = () => {
    console.log(`Building Docker images using docker-compose.build.yml...`);
    execSync(`docker compose -f docker-compose.build.yml build`, { stdio: 'inherit' });
};

const dockerUp = (composeFile) => {
    console.log(`Starting Docker containers using ${composeFile} --build...`);
    execSync(`docker compose -f ${composeFile} up --build -d`, { stdio: 'inherit' });
};

const dockerRun = (composeFile) => {
    dockerDownAll();
    dockerUp(composeFile);
}

program
    .command('build')
    .description('Build Docker images')
    .action(() => {
        dockerDownAll();
        dockerCleanup(['lmh-frontend', 'lmh-backend']);
        dockerBuild('docker-compose.build.yml');
        dockerDownAll();
    });

program
    .command('prod')
    .description('Start Docker containers')
    .action(() => {
        dockerRun('docker-compose.prod.yml');
    });

program
    .command('staging')
    .description('Start Docker containers in staging mode')
    .action(() => {
        dockerDownAll();
        dockerRun('docker-compose.staging.yml');
    });

program
    .command('down')
    .description('Start Docker containers in development mode')
    .action(() => {
        dockerDownAll();
    });

program
    .command('services')
    .description('Run local services in docker containers')
    .action(() => {
        dockerRun('docker-compose.staging.yml');
    });



const getPackageVersion = (packagePath) => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version;
};

function updateAndPublishPackage(packageDir, origDir) {
    shell.cd(packageDir);
    execSync('npm version patch');
    execSync('npm publish');
    const newVersion = getPackageVersion(path.join(packageDir, 'package.json'));
    ['frontend', 'backend'].forEach(targetDir => updateTarget(targetDir, newVersion));
}

function updateTarget(targetDir, newVersion) {
    shell.cd(`./${targetDir}`);
    execSync(`yarn add "living-mile-high-types@${newVersion}"`);
    shell.cd('../');
}

program
    .command('publish-types')
    .description('Publish types')
    .action(() => {
        const origDir = process.cwd();
        const typesDir = path.join(origDir, 'living-mile-high-types');
        updateAndPublishPackage(typesDir, origDir);
    });

const ENVS = ['.env.production', '.env.staging', '.env.development', '.env'];
const ACTIONS = ['push', 'pull'];

function cdnClient() {
    return new S3Client({
        endpoint: CDN_ENDPOINT,
        credentials: {
            accessKeyId: CDN_KEY,
            secretAccessKey: CDN_SECRET,
        },
        region: CDN_REGION,
        forcePathStyle: true, // needed for spaces endpoint compatibility
    });
}

async function pullEnv(env, doForce) {
    const client = cdnClient()
    const targetPath = path.resolve(__dirname, `../${env}`);

    if (fs.existsSync(targetPath) && !doForce) {
        console.log(`File ${env} already exists in the root directory. Use -f to overwrite.`);
        return;
    }

    try {
        const command = new GetObjectCommand({
            Bucket: CDN_BUCKET,
            Key: env
        });
        const { Body } = await client.send(command);

        const fileStream = fs.createWriteStream(targetPath);
        Body.pipe(fileStream);
        Body.on('error', (err) => {
            throw err;
        });
        Body.on('end', () => {
            console.log(`Environment variables for ${env} fetched successfully.`);
        });
    } catch (err) {
        console.error(`Failed to fetch environment variables for ${env}:`, err.message);
    }
}

async function pushEnv(env) {
    const client = cdnClient();
    const targetPath = path.resolve(__dirname, `../${env}`);

    if (!fs.existsSync(targetPath)) {
        console.log(`File .env.${env} does not exist in the root directory.`);
        return;
    }

    try {
        const fileContent = fs.readFileSync(targetPath);
        const command = new PutObjectCommand({
            Bucket: CDN_BUCKET,
            Key: env,
            Body: fileContent
        });

        await client.send(command);
        console.log(`Environment variables for ${env} pushed successfully.`);
    } catch (err) {
        console.error(`Failed to push environment variables for ${env}:`, err.message);
    }
}


program
    .command('envs <action>')
    .description('Fetch environment variables for the specified environment')
    .option('-f, --force', 'Force overwrite if the file exists')
    .action(async (action, options) => {
        const doForce = options.force;

        if (!ACTIONS.includes(action)) {
            console.error(`Invalid action: ${action} (Allowed: ${ACTIONS.join(', ')})`);
            return;
        }

        switch (action) {
            case 'push':
                await Promise.all(ENVS.map(env => pushEnv(env)));
                break;
            case 'pull':
                await Promise.all(ENVS.map(env => pullEnv(env, doForce)));
                break;
        }
    });

const resetDataDir = () => {
    if (fs.existsSync(path.resolve(__dirname, '../.data'))) {
        throw new Error('Data directory already exists. Please remove it before running this command.');
    }

    const data_services = ['mongo', 'minio'];
    const data_categories = ['development', 'production', 'staging'];

    const data_dirs = data_services.map(s => data_categories.map(c => `../.data/${s}/${c}`)).flat();

    data_dirs.forEach(dir => fs.mkdirSync(path.resolve(__dirname, dir), { recursive: true }));
}

const createBucket = async (port) => {
    try {
        const client = new S3Client({
            endpoint: `http://localhost:${port}`,
            region: 'sfo3',
            credentials: {
                accessKeyId: MINIO,
                secretAccessKey: MINIO,
            },
            forcePathStyle: true,
        });

        const buckets = await client.send(new ListBucketsCommand({}));
        const bucketExists = buckets.Buckets.some(bucket => bucket.Name === CDN_BUCKET);

        if (!bucketExists) {
            // Create the bucket
            const createBucketParams = { Bucket: CDN_BUCKET };
            await client.send(new CreateBucketCommand(createBucketParams));
            console.log(`Bucket created: ${CDN_BUCKET}`);
        } else {
            console.log(`Bucket already exists: ${CDN_BUCKET}`);
        }
    } catch (err) {
        console.error('Error:', err);
    }
};

const resetServices = async () => {
    resetDataDir();
    dockerDownAll();
    execSync(`docker compose -f docker-compose.setup-services.yml up --build -d`, { stdio: 'inherit' });
    await Promise.all([9000, 9001].map(p => createBucket(p)));
    dockerDown('docker-compose.setup-services.yml');
}

program
    .command('reset-services')
    .description('Setup local services')
    .action(async () => {
        resetServices();
    });

program.parse(process.argv);
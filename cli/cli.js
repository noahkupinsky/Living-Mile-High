#!/usr/bin/env node

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { execSync } = require('child_process');
const { program } = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dockerCleanup = (images) => {
    console.log('Cleaning up Docker containers and images...');
    shell.exec(`docker rmi ${images.join(' ')}`);
};

const dockerDown = (composeFile) => {
    console.log(`Shutting down Docker containers using ${composeFile}...`);
    if (shell.exec(`docker-compose -f ${composeFile} down`).code !== 0) {
        throw new Error(`Failed to shut down Docker containers using ${composeFile}`);
    }
};

const dockerDownAll = () => {
    dockerDown('docker-compose.build.yml');
    dockerDown('docker-compose.prod.yml');
    dockerDown('docker-compose.staging.yml');
    dockerDown('docker-compose.services.yml');
}

const dockerBuild = () => {
    console.log(`Building Docker images using docker-compose.build.yml...`);
    if (shell.exec(`docker compose -f docker-compose.build.yml build`).code !== 0) {
        throw new Error(`Failed to build Docker images using docker-compose.build.yml`);
    }
};

const dockerUp = (composeFile) => {
    console.log(`Starting Docker containers using ${composeFile} --build...`);
    if (shell.exec(`docker compose -f ${composeFile} up --build -d`).code !== 0) {
        throw new Error(`Failed to start Docker containers using ${composeFile}`);
    }
};

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
        dockerDownAll();
        dockerUp('docker-compose.prod.yml');
    });

program
    .command('staging')
    .description('Start Docker containers in staging mode')
    .action(() => {
        dockerDownAll();
        dockerUp('docker-compose.staging.yml');
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
        dockerDownAll();
        dockerUp('docker-compose.staging.yml');
    });

// Function to get the package version
const getPackageVersion = (packagePath) => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version;
};

function updateAndPublishPackage(packageDir, origDir) {
    shell.cd(packageDir);
    shell.exec('npm version patch');
    shell.exec('npm publish');
    const newVersion = getPackageVersion(path.join(packageDir, 'package.json'));
    ['frontend', 'backend'].forEach(targetDir => updateTarget(targetDir, newVersion));
}

function updateTarget(targetDir, newVersion) {
    shell.cd(`./${targetDir}`);
    shell.exec(`yarn add "living-mile-high-types@${newVersion}"`);
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

const ENVS = ['production', 'staging', 'development'];
const ACTIONS = ['push', 'pull'];
const BUCKET = 'livingmilehigh-space';

async function pullEnv(client, env, doForce) {
    const fileName = `.env.${env}`;
    const targetPath = path.resolve(__dirname, `../.env.${env}`);

    if (fs.existsSync(targetPath) && !doForce) {
        console.log(`File .env.${env} already exists in the root directory. Use -f to overwrite.`);
        return;
    }

    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET,
            Key: fileName
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

async function pushEnv(client, env) {
    const fileName = `.env.${env}`;
    const targetPath = path.resolve(__dirname, `../.env.${env}`);

    if (!fs.existsSync(targetPath)) {
        console.log(`File .env.${env} does not exist in the root directory.`);
        return;
    }

    try {
        const fileContent = fs.readFileSync(targetPath);
        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: fileName,
            Body: fileContent
        });

        await client.send(command);
        console.log(`Environment variables for ${env} pushed successfully.`);
    } catch (err) {
        console.error(`Failed to push environment variables for ${env}:`, err.message);
    }
}


program
    .command('envs <action> <region> <key> <secret>')
    .description('Fetch environment variables for the specified environment')
    .option('-f, --force', 'Force overwrite if the file exists')
    .action(async (action, region, key, secret, options) => {
        const doForce = options.force;

        if (!ACTIONS.includes(action)) {
            console.error(`Invalid action: ${action} (Allowed: ${ACTIONS.join(', ')})`);
            return;
        }

        const client = new S3Client({
            endpoint: `https://${region}.digitaloceanspaces.com`,
            credentials: {
                accessKeyId: key,
                secretAccessKey: secret,
            },
            region: region,
            forcePathStyle: true, // needed for spaces endpoint compatibility
        });

        switch (action) {
            case 'push':
                await Promise.all(ENVS.map(env => pushEnv(client, env)));
                break;
            case 'pull':
                await Promise.all(ENVS.map(env => pullEnv(client, env, doForce)));
                break;
        }
    });

async function latest() {
    try {
        console.log('Pulling from the repository...');
        execSync('git checkout main', { stdio: 'inherit' });
        execSync('git branch --set-upstream-to=origin/main', { stdio: 'inherit' });
        execSync('git pull', { stdio: 'inherit' });

        const lockFiles = [
            './yarn.lock',
            './package-lock.json',
            './backend/yarn.lock',
            './backend/package-lock.json',
            './frontend/yarn.lock',
            './frontend/package-lock.json',
            './cli/yarn.lock',
            './cli/package-lock.json',
        ];

        console.log('Deleting lock files...');
        lockFiles.forEach((file) => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                console.log(`Deleted ${file}`);
            }
        });

        console.log('Reinstalling packages...');
        execSync('yarn install', { stdio: 'inherit' });
        execSync('yarn install', { cwd: './backend', stdio: 'inherit' });
        execSync('yarn install', { cwd: './frontend', stdio: 'inherit' });
        execSync('yarn install', { cwd: './cli', stdio: 'inherit' });

        console.log('Fetching the latest environment variables...');
        await Promise.all(ENVS.map((env) => pullEnv(client, env, true)));
    } catch (err) {
        console.error('Error executing latest command:', err.message);
    }
}

program
    .command('latest')
    .description('Pull from the repo, delete lock files, reinstall packages, and fetch the latest env vars')
    .action(async () => {
        await latest();
    });

program.parse(process.argv);
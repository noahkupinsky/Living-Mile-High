#!/usr/bin/env node

const dotenv = require('dotenv');
const { program } = require('commander');
const shell = require('shelljs');
const fs = require('fs');

const ENV_FILE_PATH = '.env';

const withEnv = (envFile, fn) => {
    setupEnv(envFile);
    const env = dotenv.config({ path: ENV_FILE_PATH }).parsed;
    try {
        return fn(env);
    } finally {
        teardownEnv();
    }
};

const setupEnv = (envFile) => {
    if (!fs.existsSync(ENV_FILE_PATH)) {
        if (shell.cp(envFile, ENV_FILE_PATH).code !== 0) {
            throw new Error('Failed to copy environment file');
        }
    }
};

const teardownEnv = () => {
    if (fs.existsSync(ENV_FILE_PATH)) {
        if (shell.rm(ENV_FILE_PATH).code !== 0) {
            throw new Error('Failed to delete environment file');
        }
    }
};

const dockerCleanup = (frontend_image, backend_image) => {
    console.log('Cleaning up Docker containers and images...');
    if (shell.exec(`docker rmi ${frontend_image} ${backend_image}`).code !== 0) {
        throw new Error('Failed to remove Docker images');
    }
};

const dockerDown = (composeFile) => {
    console.log(`Shutting down Docker containers using ${composeFile}...`);
    if (shell.exec(`docker-compose -f ${composeFile} down`).code !== 0) {
        throw new Error(`Failed to shut down Docker containers using ${composeFile}`);
    }
};

const dockerBuild = (composeFile) => {
    console.log(`Building Docker images using ${composeFile}...`);
    if (shell.exec(`docker compose -f ${composeFile} build`).code !== 0) {
        throw new Error(`Failed to build Docker images using ${composeFile}`);
    }
};

const dockerPull = (composeFile) => {
    console.log(`Pulling latest Docker images using ${composeFile}...`);
    if (shell.exec(`docker compose -f ${composeFile} pull`).code !== 0) {
        throw new Error(`Failed to pull Docker images using ${composeFile}`);
    }
};

const dockerUp = (composeFile, build = false) => {
    const buildOption = build ? '--build' : '';
    console.log(`Starting Docker containers using ${composeFile} ${buildOption}...`);
    if (shell.exec(`docker compose -f ${composeFile} up ${buildOption}`).code !== 0) {
        throw new Error(`Failed to start Docker containers using ${composeFile}`);
    }
};

const dockerLogin = (username, password) => {
    console.log('Logging in to Docker...');
    if (shell.exec(`docker login -u ${username} -p ${password}`).code !== 0) {
        throw new Error('Failed to log in to Docker');
    }
};

const dockerPush = (composeFile) => {
    console.log('Pushing Docker images to registry...');
    if (shell.exec(`docker compose -f ${composeFile} push`).code !== 0) {
        throw new Error('Failed to push Docker images');
    }
};

program
    .command('build [envFile]')
    .description('Build Docker images')
    .option('--push', 'Push Docker images to registry')
    .action((envFile = '.env.production', options) => {
        withEnv(envFile, (env) => {
            const { DOCKER_USERNAME, DOCKER_PASSWORD, FRONTEND_IMAGE, BACKEND_IMAGE } = env;

            dockerDown('docker-compose.start.yml');
            dockerCleanup(FRONTEND_IMAGE, BACKEND_IMAGE);
            dockerBuild('docker-compose.build.yml');
            dockerDown('docker-compose.build.yml');

            if (options.push) {
                dockerLogin(DOCKER_USERNAME, DOCKER_PASSWORD);
                dockerPush('docker-compose.build.yml');
            }
        });
    });

program
    .command('start [envFile]')
    .description('Start Docker containers')
    .option('--pull', 'Pull latest Docker images from registry')
    .action((envFile = '.env.production', options) => {
        withEnv(envFile, (env) => {
            const { FRONTEND_IMAGE, BACKEND_IMAGE } = env;

            dockerDown('docker-compose.start.yml');

            if (options.pull) {
                dockerCleanup(FRONTEND_IMAGE, BACKEND_IMAGE);
                dockerPull('docker-compose.start.yml');
            }

            dockerUp('docker-compose.start.yml', true);
        });
    });

program
    .command('dev [envFile]')
    .description('Start Docker containers in development mode')
    .action((envFile = '.env.development') => {
        withEnv(envFile, (env) => {
            dockerDown('docker-compose.dev.yml');
            dockerUp('docker-compose.dev.yml', true);
        });
    });

program
    .command('publish-types')
    .description('Publish types')
    .action(() => {
        console.log('Publishing types...');
        if (shell.exec('sh ./publish_types.sh').code !== 0) {
            throw new Error('Failed to publish types');
        }
    });

program.parse(process.argv);
import { execSync } from 'child_process';
import { Compose, config } from '../config';

export function dockerBuild(compose: Compose) {
    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    console.log('Building Docker images...');
    execSync(`docker compose -f-f ${composeFile} --env-file ${envFile} build`, { stdio: 'inherit' });
}

export function dockerRun(compose: Compose) {
    dockerDown(compose);

    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    console.log(`Starting Docker containers using compose file ${composeFile} and env file ${envFile}...`);
    console.log(`docker compose -f ${composeFile} --env-file ${envFile} up --build -d`);
    execSync(`docker compose -f ${composeFile} --env-file ${envFile} up --build -d`, { stdio: 'inherit' });
}

export function dockerDown(compose: Compose) {
    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    console.log(`Shutting down Docker containers using ${composeFile}...`);
    execSync(`docker compose -f ${composeFile} --env-file ${envFile} down`, { stdio: 'inherit' });
}

export function dockerDownAll() {
    console.log('Shutting down all Docker containers...');
    for (const compose of Object.values(config.composes)) {
        dockerDown(compose);
    }
}

export function dockerCleanup(images: string[]) {
    console.log('Cleaning up Docker images...');
    execSync(`docker rmi ${images.join(' ')}`, { stdio: 'inherit' });
}

export function dockerRemoveVolumes() {
    const volumes = config.nonProdVolumes;

    for (const v of volumes) {
        try {
            execSync(`docker volume rm ${v}`);
        } catch (e) {
            //ignore
        }
    }
}

export function dockerPush(compose: Compose) {
    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    console.log(`Pushing Docker images using compose file ${composeFile} and env file ${envFile}...`);
    execSync(`docker compose -f ${composeFile} --env-file ${envFile} push`, { stdio: 'inherit' });
}
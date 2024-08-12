import { execSync } from 'child_process';
import { Compose, config, ROOT_PATH } from '../config';
import shell from 'shelljs';

function execCompose(compose: Compose, command: string) {
    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    shell.cd(ROOT_PATH);
    shell.exec(`docker compose -f ${composeFile} --env-file ${envFile} ${command}`);
}

export function dockerBuild(compose: Compose) {
    console.log('Building Docker images...');
    execCompose(compose, 'build');
}

export function dockerRun(compose: Compose) {
    dockerDown(compose);

    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    console.log(`Starting Docker containers using compose file ${composeFile} and env file ${envFile}...`);
    execCompose(compose, 'up --build -d');
}

export function dockerDown(compose: Compose) {
    const composeFile = compose.composeFile;
    console.log(`Shutting down Docker containers using ${composeFile}...`);
    execCompose(compose, 'down');
}

export function dockerDownAll() {
    console.log('Shutting down all Docker containers...');
    Object.values(config.composes).forEach(dockerDown);
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

export function dockerPull(compose: Compose) {
    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    console.log(`Pulling Docker images using compose file ${composeFile}...`);
    execCompose(compose, 'pull');
}

export function dockerPush(compose: Compose) {
    const composeFile = compose.composeFile;
    const envFile = compose.envFile;
    console.log(`Pushing Docker images using compose file ${composeFile} and env file ${envFile}...`);
    execCompose(compose, 'push');
}

export async function withCompose(compose: Compose, fn: () => Promise<void>) {
    dockerRun(compose);
    try {
        await fn();
    } finally {
        dockerDown(compose);
    }
}
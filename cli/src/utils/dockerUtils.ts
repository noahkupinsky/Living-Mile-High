import { execSync } from 'child_process';
import { config } from '../config';

export function dockerBuild(composeFile: string) {
    console.log('Building Docker images...');
    execSync(`docker compose -f ${composeFile} build`, { stdio: 'inherit' });
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
        config.composeBuildFile,
        config.composeProdFile,
        config.composeStagingFile,
        config.composeDevServicesFile,
        config.composeStagingServicesFile,
    ];
    files.forEach(file => dockerDown(file));
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
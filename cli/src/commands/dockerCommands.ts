import { Command } from 'commander';
import { dockerBuild, dockerRun, dockerDownAll, dockerCleanup, resetServices } from '../utils/dockerUtils';

export function dockerCommands(program: Command) {
    program
        .command('build')
        .description('Build Docker images')
        .action(() => {
            dockerDownAll();
            dockerCleanup(['lmh-frontend', 'lmh-backend']);
            dockerBuild();
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
        .description('Stop all Docker containers')
        .action(() => {
            dockerDownAll();
        });

    program
        .command('services')
        .description('Run local services in Docker containers')
        .action(() => {
            dockerRun('docker-compose.staging.yml');
        });

    program
        .command('reset-services')
        .description('Setup local services')
        .action(async () => {
            await resetServices();
        });
}
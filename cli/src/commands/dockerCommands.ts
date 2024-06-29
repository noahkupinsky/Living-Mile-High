import { Command } from 'commander';
import { dockerBuild, dockerRun, dockerDownAll, dockerCleanup } from '../utils/dockerUtils';
import { config } from '../config';
import { resetServices } from '../utils/resetServices';

export function dockerCommands(program: Command) {
    program
        .command('build')
        .description('Build Docker images')
        .action(() => {
            dockerDownAll();
            dockerCleanup(['lmh-frontend', 'lmh-backend']);
            dockerBuild(config.composeBuildFile);
            dockerDownAll();
        });

    program
        .command('prod')
        .description('Start Docker containers')
        .action(() => {
            dockerRun(config.composeProdFile);
        });

    program
        .command('staging')
        .description('Start Docker containers in staging mode')
        .action(() => {
            dockerDownAll();
            dockerRun(config.composeStagingFile);
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
            dockerRun(config.composeDevServicesFile);
        });

    program
        .command('reset-services')
        .description('Setup local services')
        .action(async () => {
            await resetServices();
        });
}
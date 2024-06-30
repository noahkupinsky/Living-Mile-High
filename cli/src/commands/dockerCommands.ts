import { Command } from 'commander';
import { dockerBuild, dockerRun, dockerDownAll, dockerCleanup, dockerDown } from '../utils/dockerUtils';
import { config } from '../config';
import { setupLocalServices } from '../utils/setupServices';
import shell from 'shelljs';

export function dockerCommands(program: Command) {
    program
        .command('down')
        .description('Stop all Docker containers')
        .action(() => {
            dockerDownAll();
        });

    program
        .command('build')
        .description('Build Docker images')
        .action(() => {
            dockerDownAll();
            dockerCleanup(['lmh-frontend', 'lmh-backend']);
            dockerBuild(config.composeBuildFile);
        });

    const prod = program
        .command('prod')
        .description('Docker prod commands')

    prod
        .command('up')
        .description('Start prod containers')
        .action(() => {
            dockerRun(config.composeProdFile);
        });

    prod
        .command('down')
        .description('Stop prod containers')
        .action(() => {
            dockerDown(config.composeProdFile);
        });

    const staging = program
        .command('staging')
        .description('Docker staging commands')

    staging
        .command('up')
        .description('Start staging containers')
        .action(() => {
            dockerDownAll();
            dockerRun(config.composeStagingFile);
        });

    staging
        .command('down')
        .description('Stop staging containers')
        .action(() => {
            dockerDown(config.composeStagingFile);
        });

    const dev = program
        .command('dev')
        .description('Docker dev commands')

    dev
        .command('up')
        .description('Start dev services')
        .action(() => {
            dockerRun(config.composeDevServicesFile);
            shell.exec('FPORT=3000 BPORT=3001 yarn dev');
        });

    dev
        .command('down')
        .description('Stop dev services')
        .action(() => {
            dockerDown(config.composeDevServicesFile);
        });

    const setup = program
        .command('setup')
        .description('Setup docker services')

    setup
        .command('local')
        .description('setup dev and staging services')
        .action(async () => {
            await setupLocalServices();
        });
}
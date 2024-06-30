import { Command } from 'commander';
import { dockerBuild, dockerRun, dockerDownAll, dockerCleanup, dockerDown } from '../utils/dockerUtils';
import { config } from '../config';
import { setupLocalServices } from '../utils/setupServices';
import shell from 'shelljs';
import { loadEnvFile } from '../utils/envUtils';

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
            dockerBuild(config.composes.build);
        });

    const prod = program
        .command('prod')
        .description('Docker prod commands')

    prod
        .command('up')
        .description('Start prod containers')
        .action(() => {
            dockerRun(config.composes.prod);
        });

    prod
        .command('down')
        .description('Stop prod containers')
        .action(() => {
            dockerDown(config.composes.prod);
        });

    const staging = program
        .command('staging')
        .description('Docker staging commands')

    staging
        .command('up')
        .description('Start staging containers')
        .action(() => {
            dockerDownAll();
            dockerRun(config.composes.staging);
        });

    staging
        .command('down')
        .description('Stop staging containers')
        .action(() => {
            dockerDown(config.composes.staging);
        });

    const dev = program
        .command('dev')
        .description('Docker dev commands')

    dev
        .command('up')
        .description('Start dev services')
        .action(() => {
            const compose = config.composes.devServices;
            dockerRun(compose);
            const { FPORT, BPORT } = loadEnvFile(compose.envFile);
            shell.exec(`FPORT=${FPORT} BPORT=${BPORT} yarn dev`);
        });

    dev
        .command('down')
        .description('Stop dev services')
        .action(() => {
            dockerDown(config.composes.devServices);
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
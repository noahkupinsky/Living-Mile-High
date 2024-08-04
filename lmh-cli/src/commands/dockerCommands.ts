import { Command } from 'commander';
import { dockerRun, dockerDownAll, dockerDown, dockerPush, dockerPull } from '../utils/dockerUtils';
import { config } from '../config';
import { massUploadHouses, setupLocalServices } from '../utils/setupServices';
import shell from 'shelljs';
import { loadEnvFile, ROOT_PATH } from '../utils/envUtils';

export function dockerCommands(program: Command) {
    registerDownCommand(program);
    registerProdCommands(program);
    registerStagingCommands(program);
    registerDevCommands(program);
    registerSetupCommands(program);
}

function registerDownCommand(program: Command) {
    program
        .command('down')
        .description('Stop all Docker containers')
        .action(() => {
            dockerDownAll();
        });
}

function registerProdCommands(program: Command) {
    const prod = program
        .command('prod')
        .description('Docker prod commands');

    prod
        .command('up')
        .description('Start prod containers')
        .option('-p, --pull', 'Pull latest images from dockerhub')
        .action(async (options) => {
            if (options.pull) {
                dockerPull(config.composes.prod);
            }
            dockerRun(config.composes.prod);
        });

    prod
        .command('superadmin')
        .description('Start superadmin service')
        .action(() => {
            dockerRun(config.composes.superadmin);
        });

    prod
        .command('build')
        .description('Build prod containers')
        .action(() => {
            dockerRun(config.composes.prodBuild);
            dockerPush(config.composes.prodBuild);
        });

    prod
        .command('down')
        .description('Stop prod containers')
        .action(() => {
            dockerDown(config.composes.prod);
            dockerDown(config.composes.prodBuild);
            dockerDown(config.composes.superadmin);
        });
}

function registerStagingCommands(program: Command) {
    const staging = program
        .command('staging')
        .description('Docker staging commands');

    staging
        .command('up')
        .description('Start staging containers')
        .action(() => {
            dockerDown(config.composes.staging);
            dockerRun(config.composes.staging);
        });

    staging
        .command('down')
        .description('Stop staging containers')
        .action(() => {
            dockerDown(config.composes.staging);
        });
}

function registerDevCommands(program: Command) {
    const dev = program
        .command('dev')
        .description('Docker dev commands');

    dev
        .command('up')
        .description('Start dev services and dev frontend + backend')
        .action(() => {
            const compose = config.composes.devServices;
            dockerRun(compose);
            const { FPORT, BPORT } = loadEnvFile(compose.envFile);
            shell.exec(`cd ${ROOT_PATH} && FPORT=${FPORT} BPORT=${BPORT} yarn dev`);
        });

    dev
        .command('down')
        .description('Stop dev services')
        .action(() => {
            dockerDown(config.composes.devServices);
        });
}

function registerSetupCommands(program: Command) {
    const setup = program
        .command('setup')
        .description('Setup docker services');

    setup
        .command('local')
        .description('Setup dev and staging services')
        .action(async () => {
            await setupLocalServices();
        });

    setup
        .command('upload')
        .description('mass upload house objects')
        .argument('<env>', 'Environment to upload to')
        .argument('<username>', 'Username')
        .argument('<password>', 'Password')
        .argument('<folder>', 'Folder to upload')
        .action(async (env: string, username: string, password: string, folder: string) => {
            await massUploadHouses(env, username, password, folder);
        });
}
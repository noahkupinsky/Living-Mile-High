import { Command } from 'commander';
import { pullEnv, pushEnv } from '../utils/envUtils';

const ENVS = ['production', 'staging', 'development'];

export function envCommands(program: Command) {
    const env = program
        .command('env')
        .description('Fetch or push environment variables (requires CDN credentials)');

    env
        .command('pull')
        .description('Pull environment variables to current directory')
        .option('-f, --force', 'Force overwrite if the file exists')
        .action(async (options) => {
            const doForce = options.force;
            await Promise.all(ENVS.map(env => pullEnv(env, doForce)));
        });

    env
        .command('push')
        .description('Push environment variables from current directory')
        .action(async () => {
            await Promise.all(ENVS.map(env => pushEnv(env)));
        });
}
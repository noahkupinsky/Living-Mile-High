import { Command } from 'commander';
import { pullEnv, pushEnv } from '../utils/envUtils';

const EnvFiles = ['.env.production', '.env.staging', '.env.development'];

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
            await Promise.all(EnvFiles.map(env => pullEnv(env, doForce)));
        });

    env
        .command('push')
        .description('Push environment variables from current directory')
        .action(async () => {
            await Promise.all(EnvFiles.map(env => pushEnv(env)));
        });
}
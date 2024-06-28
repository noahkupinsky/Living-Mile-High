import { Command } from 'commander';
import { pullEnv, pushEnv } from '../utils/envUtils';

export function envCommands(program: Command) {
    program
        .command('envs <action>')
        .description('Fetch or push environment variables')
        .option('-f, --force', 'Force overwrite if the file exists')
        .action(async (action, options) => {
            const doForce = options.force;
            if (action === 'push') {
                await Promise.all(['.env.production', '.env.staging', '.env.development', '.env'].map(env => pushEnv(env)));
            } else if (action === 'pull') {
                await Promise.all(['.env.production', '.env.staging', '.env.development', '.env'].map(env => pullEnv(env, doForce)));
            } else {
                console.error(`Invalid action: ${action}`);
            }
        });
}
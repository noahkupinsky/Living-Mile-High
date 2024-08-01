import { Command } from 'commander';
import { updateAndPublishPackage } from '../utils/packageUtils';

export function packageCommands(program: Command) {
    program
        .command('publib')
        .description('Publish types')
        .action(() => {
            const packageName = 'living-mile-high-lib';
            updateAndPublishPackage(packageName);
        });
}
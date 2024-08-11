import { Command } from 'commander';
import { updatePackage } from '../utils/packageUtils';

export function packageCommands(program: Command) {
    program
        .command('loadlib')
        .description('reload the library')
        .action(() => {
            const packageName = 'living-mile-high-lib';
            updatePackage(packageName);
        });
}
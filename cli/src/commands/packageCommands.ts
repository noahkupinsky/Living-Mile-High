import { Command } from 'commander';
import { updateAndPublishPackage } from '../utils/packageUtils';
import path from 'path';

export function packageCommands(program: Command) {
    program
        .command('publib')
        .description('Publish types')
        .action(() => {
            const origDir = process.cwd();
            const libDir = path.join(origDir, 'lib');
            const packageName = 'living-mile-high-lib';
            updateAndPublishPackage(libDir, origDir, packageName);
        });
}
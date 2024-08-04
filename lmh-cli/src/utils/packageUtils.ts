import shell from 'shelljs';
import { ROOT_PATH } from './envUtils';

export function updatePackage(packageName: string) {
    shell.cd(ROOT_PATH);
    ['frontend', 'backend', 'lmh-cli', 'superadmin'].forEach(dir => {
        shell.cd(dir);
        shell.exec(`yarn add "${packageName}"`);
        shell.exec(`yarn upgrade "${packageName}"`);
        shell.cd('../');
    });
}
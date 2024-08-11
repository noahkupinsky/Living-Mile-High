import shell from 'shelljs';
import { joinRoot } from '../config';

export function updatePackage(packageName: string) {
    ['frontend', 'backend', 'lmh-cli'].forEach(dir => {
        shell.cd(joinRoot(dir));
        shell.exec(`yarn remove "${packageName}"`);
        shell.exec(`yarn add "${packageName}"`);
    });
}
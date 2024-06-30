import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

export function updateAndPublishPackage(packageDir: string, origDir: string, packageName: string) {
    shell.cd(packageDir);
    shell.exec('npm version patch');
    shell.exec('npm publish');
    const newVersion = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')).version;
    shell.cd(origDir);
    ['frontend', 'backend', 'cli'].forEach(dir => {
        shell.cd(dir);
        shell.exec(`yarn add "${packageName}@${newVersion}"`);
        shell.cd('../');
    });
}
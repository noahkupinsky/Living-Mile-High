import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

export function updateAndPublishPackage(packageDir: string, origDir: string) {
    shell.cd(packageDir);
    shell.exec('npm version patch');
    shell.exec('npm publish');
    const newVersion = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')).version;
    shell.cd(origDir);
    ['frontend', 'backend'].forEach(dir => {
        shell.cd(dir);
        shell.exec(`yarn add "library@${newVersion}"`);
        shell.cd('../');
    });
}
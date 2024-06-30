import shell from 'shelljs';

export function updateAndPublishPackage(packageDir: string, origDir: string, packageName: string) {
    shell.cd(packageDir);
    shell.exec('npm version patch');
    shell.exec('npm publish');
    shell.cd(origDir);
    ['frontend', 'backend', 'cli', 'superadmin'].forEach(dir => {
        shell.cd(dir);
        shell.exec(`yarn remove "${packageName}"`);
        shell.exec(`yarn add "${packageName}"`);
        shell.cd('../');
    });
}
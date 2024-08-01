import shell from 'shelljs';

export function updateAndPublishPackage(packageName: string) {
    shell.cd('lib');
    shell.exec('npm version patch');
    shell.exec('npm publish');
    shell.cd('../');
    ['frontend', 'backend', 'cli', 'superadmin'].forEach(dir => {
        shell.cd(dir);
        shell.exec(`yarn remove "${packageName}"`);
        shell.exec(`yarn add "${packageName}"`);
        shell.cd('../');
    });
}
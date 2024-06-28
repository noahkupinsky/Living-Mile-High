import { program } from 'commander';
import { dockerCommands } from './commands/dockerCommands';
import { envCommands } from './commands/envCommands';
import { packageCommands } from './commands/packageCommands';

dockerCommands(program);
envCommands(program);
packageCommands(program);

program.parse(process.argv);
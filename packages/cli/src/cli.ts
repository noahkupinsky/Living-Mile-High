#!/usr/bin/env node

import { program } from 'commander';
import { dockerCommands } from './commands/dockerCommands';
import { envCommands } from './commands/envCommands';
import { packageCommands } from './commands/packageCommands';
import { superadminCommands } from './commands/superadminCommands';

dockerCommands(program);
envCommands(program);
packageCommands(program);
superadminCommands(program);

program.parse(process.argv);
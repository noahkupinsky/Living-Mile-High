import { Command } from "commander";
import { upsertAdmin, withMongo } from "../utils/admin";
import { PROD_MONGO_URI } from "../utils/envUtils";

export function superadminCommands(program: Command) {
    const superadmin = program.command('superadmin')
        .description('Superadmin commands')

    superadmin.command('upsert')
        .argument('<username>', 'username')
        .argument('<password>', 'password')
        .description('Upsert superadmin')
        .action(async (username, password) => {
            await withMongo(PROD_MONGO_URI, async () => {
                await upsertAdmin(username, password);
            })
        });
}
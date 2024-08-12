import { Command } from "commander";
import { deleteAdmin, upsertAdmin, withMongo } from "../utils/admin";
import { withCompose } from "../utils/dockerUtils";
import { config, joinEnv } from "../config";
import { loadEnvFile } from "../utils/envUtils";

const { MONGODB_USERNAME, MONGODB_PASSWORD } = loadEnvFile(joinEnv('production'));
const SUPERADMIN_MONGO_URI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@localhost:27017/`;

export function superadminCommands(program: Command) {
    const superadmin = program.command('superadmin')
        .description('Superadmin commands')

    superadmin.command('upsert')
        .argument('<username>', 'username')
        .argument('<password>', 'password')
        .description('Upsert superadmin')
        .action(async (username, password) => {
            await withCompose(config.composes.prodServices, async () => {
                await withMongo(SUPERADMIN_MONGO_URI, async () => {
                    await upsertAdmin(username, password);
                })
            })
        });

    superadmin.command('delete')
        .argument('<username>', 'username')
        .description('Delete superadmin')
        .action(async (username) => {
            await withCompose(config.composes.prodServices, async () => {
                await withMongo(SUPERADMIN_MONGO_URI, async () => {
                    await deleteAdmin(username);
                })
            })
        });
}
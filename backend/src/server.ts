import env from '~/config/env';
import { getServer, setupApp } from '~/app';
import { updateFixedKeys } from './controllers/cdnController';
import { services } from './di';

const server = getServer();

const startServer = async () => {
    try {
        const { BPORT } = env();
        await setupApp();

        await ensureFixedKeysExist();

        server.listen(BPORT, () => {
            console.log(`Server started on port ${BPORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

/** Update fixed keys in case they haven't been initialized yet
 * no need to create a backup or prune, 
 * as no actual data update needs to be reflected --
 * this is just an initialization formality
**/
const ensureFixedKeysExist = async () => {
    await updateFixedKeys();
    await services().cdnAdapter.refreshCache();
}

startServer();
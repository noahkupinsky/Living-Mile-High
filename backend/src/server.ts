import env from './config/env';
import { getServer, setupApp } from './app';
import newServiceManager from './config/di';

const server = getServer();

const startServer = async () => {
    try {
        const { MOCK, BPORT } = env();
        const sm = newServiceManager(MOCK === 'true');
        await setupApp(sm);

        server.listen(BPORT, () => {
            console.log(`Server started on port ${BPORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
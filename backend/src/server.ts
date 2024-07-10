import env from '~/config/env';
import { getServer, setupApp } from '~/app';

const server = getServer();

const startServer = async () => {
    try {
        const { MOCK, BPORT } = env();
        await setupApp(MOCK === 'true');

        server.listen(BPORT, () => {
            console.log(`Server started on port ${BPORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
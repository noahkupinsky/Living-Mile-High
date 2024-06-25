import env from './config/env';
import { getServer, setupApp } from './app';
import newServiceManager from './config/di';

const server = getServer();

const startServer = async () => {
    try {
        const servicesConfig = {};

        const services = await newServiceManager(env().MOCK === 'true');
        await setupApp(services);

        const backendPort = env().BPORT;
        server.listen(backendPort, () => {
            console.log(`Server started on port ${backendPort}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
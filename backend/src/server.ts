import env from './config/env';
import { getServer, setupApp } from './app';
import createServices from './config/di';

const server = getServer();

const startServer = async () => {
    try {
        const servicesConfig = {};

        const services = await createServices(servicesConfig);
        await setupApp(services);

        const backendPort = env('BACKEND_PORT');
        server.listen(backendPort, () => {
            console.log(`Server started on port ${backendPort}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
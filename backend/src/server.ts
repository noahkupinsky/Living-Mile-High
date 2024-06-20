import env from './config/env';
import { createApp } from './app';
import createServices from './config/di';

const startServer = async () => {
    try {
        const services = await createServices();
        const app = await createApp(services);
        const backendPort = env('BACKEND_PORT');
        app.listen(backendPort, () => {
            console.log(`Server started on port ${backendPort}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
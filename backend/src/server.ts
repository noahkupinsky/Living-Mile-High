import dotenv from 'dotenv';
import createApp from './app';
import MongoDatabase from './database';
import { MONGODB_ATLAS_URI, BACKEND_PORT } from './env';

dotenv.config();

const database = new MongoDatabase(MONGODB_ATLAS_URI);

const startServer = async () => {
    try {
        const app = await createApp(database);

        app.listen(BACKEND_PORT, () => {
            console.log(`Server started on port ${BACKEND_PORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
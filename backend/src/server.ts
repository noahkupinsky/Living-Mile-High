import dotenv from 'dotenv';
import { createApp } from './app';
import MongoDatabase from './database';
import { MONGODB_ATLAS_URI, API_PORT } from './env';
import { SpaceImageService } from './services/imageService';
import AppServices from './services/appServices';

dotenv.config();

const database = new MongoDatabase(MONGODB_ATLAS_URI);
const imageService = new SpaceImageService();
const appServices = new AppServices(database, imageService);

const startServer = async () => {
    try {
        await appServices.connect();
        const app = await createApp(appServices);

        app.listen(API_PORT, () => {
            console.log(`Server started on port ${API_PORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
import dotenv from 'dotenv';
import createApp from './app';
import MongoDatabase from './database';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI!;

const database = new MongoDatabase(MONGODB_ATLAS_URI);

const startServer = async () => {
    try {
        const app = await createApp(database);

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
};

startServer();
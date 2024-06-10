import express from 'express';
import dotenv from 'dotenv';
import createRoutes from './routes';
import UserService from './services/UserService';
import { IDatabase } from './database';

dotenv.config();

const createApp = async (database: IDatabase) => {
    const app = express();
    app.use(express.json());

    try {
        await database.connect();
        console.log('Database connected');

        const userService = new UserService();
        const router = createRoutes(userService);
        app.use(router);

        return app;
    } catch (error) {
        console.error('Error related to Database', error);
        throw error;
    }
};

export default createApp;
import express from 'express';
import createRoutes from './routes';
import AdminService from './services/AdminService';
import { IDatabase } from './database';
import { AuthService } from './services/AuthService';
import './env';

const createApp = async (database: IDatabase) => {
    const app = express();
    app.use(express.json());

    try {
        await database.connect();
        console.log('Database connected');

        const adminService = new AdminService();
        const authService = new AuthService(adminService);
        const router = createRoutes(adminService, authService);
        app.use(router);

        return app;
    } catch (error) {
        console.error('Error related to Database', error);
        throw error;
    }
};

export default createApp;
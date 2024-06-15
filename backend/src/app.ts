import express from 'express';
import createRoutes from './routes';
import './env';
import { AppConfig } from './@types/index';
import passport from 'passport';

export async function createApp(appConfig: AppConfig): Promise<express.Application> {
    const { database } = appConfig;
    const app = express();
    app.use(express.json());
    app.use(passport.initialize());

    try {
        await database.connect();
        console.log('Database connected');

        const router = createRoutes();
        app.use(router);

        return app;
    } catch (error) {
        console.error('Error related to Database', error);
        throw error;
    }
};



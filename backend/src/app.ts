import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import http, { Server as HTTPServer } from 'http';
import { AppServices, ServiceManager } from './types';

let serviceManager: ServiceManager<AppServices> | null = null;
let appServices: AppServices | null = null;
const app = express();
const server = http.createServer(app);

export async function setupApp(sm: ServiceManager<AppServices>): Promise<void> {
    serviceManager = sm;
    appServices = await serviceManager.connect();
    app.use(cors(
        {
            origin: true,
            credentials: true
        }
    ));
    app.use(express.json());
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(router);
}

export async function teardown() {
    if (serviceManager) {
        await serviceManager.disconnect();
    }
    if (server) {
        server.close();
    }
}

export function services(): AppServices {
    if (!appServices) {
        throw new Error('AppConfig has not been initialized. Call initializeAppConfig first.');
    }
    return appServices;
}

export const getApp = () => app;
export const getServer = () => server;


import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
import { IAppServices, ServiceKey } from './@types/index';
import { ExpressMiddleware } from './@types/express';
import passport from './config/passport';
import { Server } from 'http';

let services: IAppServices | null = null;
let app: express.Application;

async function setupApp(appServices: IAppServices): Promise<void> {
    services = appServices;
    await services.connect();
    app = express();
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

export async function createApp(appServices: IAppServices): Promise<express.Application> {
    try {
        await setupApp(appServices);
        return app;
    } catch (error) {
        console.error('Error setting up app', error);
        throw error;
    }
};

export async function teardown(server: Server | null = null) {
    if (services) {
        await services.disconnect();
    }
    if (server) {
        server.close();
    }
}

export function getService(service: ServiceKey): any {
    if (!services) {
        throw new Error('AppConfig has not been initialized. Call initializeAppConfig first.');
    }
    return services.getService(service);
}

export function getApp(): express.Application {
    if (!app) {
        throw new Error('App has not been initialized. Call createApp first.');
    }
    return app;
}

// Middleware to log requests
const logRequests: ExpressMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

// Middleware to log responses
const logResponses: ExpressMiddleware = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`Response: ${res.statusCode} ${body}`);
        return originalSend.call(this, body);
    };
    next();
};




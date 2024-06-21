import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
import { IAppServices, AppServiceDict } from './types/appServices';
import { ExpressMiddleware } from './types/express';
import passport from './config/passport';
import { Server } from 'http';

let appServices: IAppServices | null = null;
let app: express.Application;

async function setupApp(services: IAppServices): Promise<void> {
    appServices = services;
    await appServices.connect();
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

export async function createApp(services: IAppServices): Promise<express.Application> {
    try {
        await setupApp(services);
        return app;
    } catch (error) {
        console.error('Error setting up app', error);
        throw error;
    }
};

export async function teardown(server: Server | null = null) {
    if (appServices) {
        await appServices.disconnect();
    }
    if (server) {
        server.close();
    }
}

export function services(): AppServiceDict {
    if (!appServices) {
        throw new Error('AppConfig has not been initialized. Call initializeAppConfig first.');
    }
    return appServices.services;
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




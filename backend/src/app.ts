import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
import { AppServiceProvider, AppServices } from './types/serviceManager';
import { ExpressMiddleware } from './types/express';
import passport from './config/passport';
import http, { Server as HTTPServer } from 'http';

let appServices: AppServiceProvider | null = null;
const app = express();
const server = http.createServer(app);

export async function setupApp(services: AppServiceProvider): Promise<void> {
    appServices = services;
    await appServices.connect();
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
    if (appServices) {
        await appServices.disconnect();
    }
    if (server) {
        server.close();
    }
}

export function services(): AppServices {
    if (!appServices) {
        throw new Error('AppConfig has not been initialized. Call initializeAppConfig first.');
    }
    return appServices.services;
}

export const getApp = () => app;
export const getServer = () => server;

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




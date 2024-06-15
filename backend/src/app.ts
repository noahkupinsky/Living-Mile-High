import express from 'express';
import router from './routes';
import { AppConfig, Database, ExpressMiddleware } from './@types/index';
import passport from './config/passport';
import './env';
import { Server } from 'http';

let appConfig: AppConfig | null = null;
let app: express.Application;

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

export function initializeAppConfig(conf: AppConfig): AppConfig {
    if (!appConfig) {
        appConfig = conf;
    }
    return appConfig;
}

export function getAppConfig(): AppConfig {
    if (!appConfig) {
        throw new Error('AppConfig has not been initialized. Call initializeAppConfig first.');
    }
    return appConfig;
}

export function getDatabase(): Database {
    return getAppConfig().database;
}

export function getApp(): express.Application {
    if (!app) {
        throw new Error('App has not been initialized. Call createApp first.');
    }
    return app;
}

async function setupApp(appConfig: AppConfig): Promise<void> {
    initializeAppConfig(appConfig);
    await getDatabase().connect();
    console.log('Database connected');

    app = express();
    app.use(express.json());
    app.use(passport.initialize());
    app.use(router);
}

export async function createApp(appConfig: AppConfig): Promise<express.Application> {
    try {
        await setupApp(appConfig);
        return app;
    } catch (error) {
        console.error('Error setting up app', error);
        throw error;
    }
};

export async function teardown(server: Server) {
    await getDatabase().disconnect();
    if (server) {
        server.close();
    }
}



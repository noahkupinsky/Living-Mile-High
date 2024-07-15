import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';

import passport from '~/config/passport';
import router from '~/routes';
import { connectServices, getServiceManager } from '~/di';

const app = express();
const server = http.createServer(app);

export async function setupApp(mock = false): Promise<void> {
    app.use(express.json());
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(cors(
        {
            origin: true,
            credentials: true
        }
    ));
    app.use(router);

    await connectServices(mock);
}

export async function teardown() {
    const serviceManager = getServiceManager();
    if (serviceManager) {
        await serviceManager.disconnect();
    }
    if (server) {
        server.close();
    }
}

export const getApp = () => app;
export const getServer = () => server;


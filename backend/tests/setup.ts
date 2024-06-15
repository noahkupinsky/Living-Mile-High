import dotenv from 'dotenv';
import { Server } from 'http';
import { LocalDatabase } from './utils/LocalDatabase';
import { teardown } from './utils/testUtils';
import { AppConfig, Database } from '../src/@types';
import { createApp } from '../src/app';
import express from 'express';

dotenv.config();

const TEST_PORT = 3001;

let database: Database;
let server: Server;
let app: express.Application;

const listener = (app: express.Application, port: number) => {
    return app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};

beforeAll(async () => {
    database = new LocalDatabase();
    const appConfig: AppConfig = {
        database: database
    }
    app = await createApp(appConfig);
    server = listener(app, TEST_PORT);
});

afterAll(async () => {
    await teardown(database, server);
});

export const getApp = () => app;
export const getServer = () => server;
export const getDatabase = () => database;
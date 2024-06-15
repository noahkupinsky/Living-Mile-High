import dotenv from 'dotenv';
import { Server } from 'http';
import { LocalDatabase } from './utils/LocalDatabase';
import { AppConfig } from '../src/@types';
import { createApp, getApp, teardown } from '../src/app';
import express from 'express';
import supertest from 'supertest';

dotenv.config();

const TEST_PORT = 3001;

let server: Server;
let app: express.Application;
let database: LocalDatabase;

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

beforeEach(async () => {
    await database.clear();
});

afterAll(async () => {
    await teardown(server);
});

export const getServer = () => server;
export const getRequest = () => supertest(getApp());
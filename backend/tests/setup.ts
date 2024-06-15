import dotenv from 'dotenv';
import { Server } from 'http';
import { createApp, getApp, teardown } from '../src/app';
import express from 'express';
import supertest from 'supertest';
import LocalAppServices from './utils/LocalAppServices';

dotenv.config();

const TEST_PORT = 3001;

let server: Server;
let app: express.Application;
let localServices: LocalAppServices;

const listener = (app: express.Application, port: number) => {
    return app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};

beforeAll(async () => {
    localServices = new LocalAppServices();
    app = await createApp(localServices);
    server = listener(app, TEST_PORT);
});

beforeEach(async () => {
    await localServices.clear();
});

afterAll(async () => {
    await teardown(server);
});

export const getServer = () => server;
export const getRequest = () => supertest(getApp());
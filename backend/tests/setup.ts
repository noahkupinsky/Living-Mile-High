import dotenv from 'dotenv';
import { Server } from 'http';
import TestAgent from 'supertest/lib/agent';
import { Test } from 'supertest';
import { LocalDatabase } from './utils/LocalDatabase';
import { setupTestServer, teardown } from './utils/testUtils';
import { AppConfig, Database } from '@/@types';

dotenv.config();

const TEST_PORT = 3001;

let database: Database;
let request: TestAgent<Test>;
let server: Server;

beforeAll(async () => {
    database = new LocalDatabase();
    const appConfig: AppConfig = {
        database: database
    }
    const setupObj = await setupTestServer(appConfig);
    request = setupObj.request;
    server = setupObj.listener(TEST_PORT);
});

afterAll(async () => {
    await teardown(database, server);
});

export const getSupertest = () => request;
export const getServer = () => server;
export const getDatabase = () => database;
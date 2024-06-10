import { MongoMemoryServer } from 'mongodb-memory-server';
import createApp from '../src/app';
import dotenv from 'dotenv';
import { Server } from 'http';
import MongoDatabase, { IDatabase } from '../src/database';
import TestAgent from 'supertest/lib/agent';
import supertest, { Test } from 'supertest';

dotenv.config();

const TEST_PORT = 3001;

class LocalDatabase implements IDatabase {
    private mongoServer: MongoMemoryServer;
    private database: MongoDatabase;

    async connect(): Promise<void> {
        this.mongoServer = await MongoMemoryServer.create();
        const mongoUri = this.mongoServer.getUri();
        this.database = new MongoDatabase(mongoUri);
        await this.database.connect();
    }
    async disconnect(): Promise<void> {
        await this.database.disconnect();
        await this.mongoServer.stop();
    }
}

let database: IDatabase;
let request: TestAgent<Test>;
let server: Server;

beforeAll(async () => {
    database = new LocalDatabase();
    const app = await createApp(database);
    request = supertest(app);
    server = app.listen(TEST_PORT, () => {
        console.log(`Server started on port ${TEST_PORT}`);
    });
});

afterAll(async () => {
    await database.disconnect();
    if (server) {
        server.close();
    }
});

export const getSupertest = () => request;
export const getServer = () => server;
export const getDatabase = () => database;
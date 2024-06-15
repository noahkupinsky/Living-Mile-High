import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoDatabase from '../../src/database';
import { Database } from '../../src/@types';

export class LocalDatabase implements Database {
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

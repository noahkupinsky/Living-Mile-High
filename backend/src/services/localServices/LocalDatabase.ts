import { MongoMemoryServer } from 'mongodb-memory-server';
import { Database, DatabaseServiceDict } from '../../types';
import mongoose, { Connection } from 'mongoose';
import MongoAdminService from '../MongoAdminService';
import { MongoHouseService } from '../MongoHouseService';

class LocalDatabase implements Database {
    private connection: Connection;
    private dbServices: DatabaseServiceDict;
    private mongoServer: MongoMemoryServer;

    constructor() {
        this.dbServices = {
            adminService: new MongoAdminService(),
            houseService: new MongoHouseService()
        };

    }

    async connect(): Promise<void> {
        this.mongoServer = await MongoMemoryServer.create();
        const mongoUri = this.mongoServer.getUri();
        await mongoose.connect(mongoUri, {});
        this.connection = mongoose.connection;
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.dropDatabase();
            await this.connection.close();
        }
        if (this.mongoServer) {
            await this.mongoServer.stop();
        }
    }

    get services(): DatabaseServiceDict {
        return this.dbServices;
    }

    async clear(): Promise<void> {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
}

export default LocalDatabase;
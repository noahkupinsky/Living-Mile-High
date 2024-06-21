import mongoose, { Connection } from 'mongoose';
import { Database, DatabaseServiceDict } from '../types';
import MongoAdminService from './MongoAdminService';
import { MongoHouseService } from './MongoHouseService';

class MongoDatabase implements Database {
    private mongoUri: string;
    private connection: Connection;
    private dbServices: DatabaseServiceDict;

    constructor(uri: string) {
        this.mongoUri = uri;
        this.dbServices = {
            adminService: new MongoAdminService(),
            houseService: new MongoHouseService()
        }
    }

    async connect(): Promise<void> {
        await mongoose.connect(this.mongoUri, {});

        this.connection = mongoose.connection;
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.dropDatabase();
            await this.connection.close();
        }
    }

    get services(): DatabaseServiceDict {
        return this.dbServices;
    }
}

export default MongoDatabase;
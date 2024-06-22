import mongoose, { Connection } from 'mongoose';
import { Database, DatabaseServiceDict } from '../../types';
import MongoAdminService from './MongoAdminService';
import MongoHouseService from './MongoHouseService';
import { ServiceProviderBase } from '../utils/ServiceProviderBase';

class MongoDatabase extends ServiceProviderBase<DatabaseServiceDict> implements Database {
    private mongoUri: string;
    private connection: Connection;

    constructor(uri: string) {
        super({
            adminService: new MongoAdminService(),
            houseService: new MongoHouseService()
        });
        this.mongoUri = uri;
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
}

export default MongoDatabase;
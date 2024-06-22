import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseServiceDict } from '../../types';
import mongoose, { Connection } from 'mongoose';
import MongoAdminService from '../database/MongoAdminService';
import MongoHouseService from '../database/MongoHouseService';
import { LocalServiceProvider } from 'src/types/serviceProvider';
import { LocalServiceProviderBase } from '../utils/ServiceProviderBase';

class LocalDatabase extends LocalServiceProviderBase<DatabaseServiceDict> implements LocalServiceProvider<DatabaseServiceDict> {
    private connection: Connection;
    private mongoServer: MongoMemoryServer;

    constructor() {
        super({
            adminService: new MongoAdminService(),
            houseService: new MongoHouseService()
        });

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

    async clear(): Promise<void> {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
}

export default LocalDatabase;
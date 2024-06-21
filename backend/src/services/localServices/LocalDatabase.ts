import { MongoMemoryServer } from 'mongodb-memory-server';
import { Database } from '../../types';
import { AdminService } from '../../types/admin';
import { HouseService } from '../../types/house';
import mongoose, { Connection } from 'mongoose';
import MongoAdminService from '../adminService';
import { MongoHouseService } from '../houseService';

export class LocalDatabase implements Database {
    private connection: Connection;
    public adminService: AdminService;
    public houseService: HouseService;
    private mongoServer: MongoMemoryServer;

    constructor() {
        this.adminService = new MongoAdminService();
        this.houseService = new MongoHouseService();
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

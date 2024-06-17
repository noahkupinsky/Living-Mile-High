import { MongoMemoryServer } from 'mongodb-memory-server';
import { Database } from '../../src/@types';
import { AdminService } from 'src/@types/admin';
import { HouseService } from 'src/@types/house';
import mongoose, { Connection } from 'mongoose';
import MongoAdminService from '../../src/services/adminService';
import { MongoHouseService } from '../../src/services/houseService';

export class LocalDatabase implements Database {
    private connection: Connection;
    public adminService: AdminService;
    public houseService: HouseService;
    private mongoServer: MongoMemoryServer;

    constructor() {
        this.adminService = new MongoAdminService(),
            this.houseService = new MongoHouseService()
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

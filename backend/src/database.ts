import mongoose, { Connection } from 'mongoose';
import { AdminService, Database, HouseService } from './@types';
import MongoAdminService from './services/adminService';
import { MongoHouseService } from './services/houseService';

class MongoDatabase implements Database {
    private mongoUri: string;
    private connection: Connection;
    private services: { adminService: AdminService, houseService: HouseService };

    constructor(uri: string) {
        this.mongoUri = uri;
        this.services = {
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

    get adminService(): AdminService {
        return this.services.adminService;
    }

    get houseService(): HouseService {
        return this.services.houseService
    }
}

export default MongoDatabase;
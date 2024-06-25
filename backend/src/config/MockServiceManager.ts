import { AppServices, ServiceManager } from "../types";
import mongoose from "mongoose";
import { createInMemoryS3CdnConfig, inMemoryCDN } from "../services/utils/createS3CdnService";
import S3CdnAdapter from "../services/cdn/S3CdnAdapter";
import CdnAppDataService from "../services/cdn/CdnAppDataService";
import CdnImageService from "../services/cdn/CdnImageService";
import MongoAdminService from "../services/database/MongoAdminService";
import MongoHouseService from "../services/database/MongoHouseService";
import { MongoMemoryServer } from "mongodb-memory-server";

class MockServiceManager implements ServiceManager<AppServices> {
    private services?: AppServices;
    private mongoServer: MongoMemoryServer;

    public async connect(): Promise<AppServices> {
        if (this.services) {
            return this.services;
        }

        this.mongoServer = await MongoMemoryServer.create();
        const mongoUri = this.mongoServer.getUri();
        await mongoose.connect(mongoUri, {});

        const s3CdnConfig = createInMemoryS3CdnConfig();
        const cdn = new S3CdnAdapter(s3CdnConfig);

        this.services = {
            cdnAdapter: cdn,
            houseService: new MongoHouseService(),
            adminService: new MongoAdminService(),
            imageService: new CdnImageService(cdn),
            appDataService: new CdnAppDataService(cdn)
        }

        return this.services!;
    }

    public async disconnect(): Promise<void> {
        if (mongoose.connection) {
            await mongoose.connection.close();
        }
        if (this.mongoServer) {
            await this.mongoServer.stop();
        }
    }

    public async clear(): Promise<void> {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        for (const key in inMemoryCDN) {
            delete inMemoryCDN[key];
        }
    }
}

export default MockServiceManager
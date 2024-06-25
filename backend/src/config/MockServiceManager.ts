import { AppServices, ServiceManager } from "../types";
import mongoose from "mongoose";
import { createInMemoryS3CdnConfig, inMemoryCDN } from "../utils/createS3CdnService";
import S3CdnAdapter from "../services/S3CdnAdapter";
import CdnAppDataService from "../services/CdnAppDataService";
import CdnImageService from "../services/CdnImageService";
import MongoAdminService from "../services/MongoAdminService";
import MongoHouseService from "../services/MongoHouseService";
import { MongoMemoryServer } from "mongodb-memory-server";
import MongoOtherService from "../services/MongoOtherService";

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
        const houseService = new MongoHouseService();
        const otherService = new MongoOtherService();

        this.services = {
            cdnAdapter: cdn,
            houseService: houseService,
            otherService: otherService,
            adminService: new MongoAdminService(),
            imageService: new CdnImageService(cdn),
            appDataService: new CdnAppDataService(cdn, houseService, otherService)
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
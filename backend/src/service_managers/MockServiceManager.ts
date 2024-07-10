import { ServiceDict, ServiceManager } from "../types";
import mongoose from "mongoose";
import { createInMemoryS3CdnConfig, inMemoryCDN } from "../utils/createS3CdnService";
import S3CdnAdapter from "../services/S3CdnAdapter";
import CdnImageService from "../services/CdnImageService";
import MongoAdminService from "../services/MongoAdminService";
import MongoHouseService from "../services/MongoHouseService";
import { MongoMemoryServer } from "mongodb-memory-server";
import MongoGeneralDataService from "../services/MongoGeneralDataService";
import MongoStateService from "../services/MongoStateService";
import CdnSiteUpdater from "../services/CdnSiteUpdater";

class MockServiceManager implements ServiceManager<ServiceDict> {
    private services?: ServiceDict;
    private mongoServer: MongoMemoryServer;

    public async connect(): Promise<ServiceDict> {
        if (this.services) {
            return this.services;
        }

        this.mongoServer = await MongoMemoryServer.create();
        const mongoUri = this.mongoServer.getUri();
        await mongoose.connect(mongoUri, {});

        const s3CdnConfig = createInMemoryS3CdnConfig();
        const cdn = new S3CdnAdapter(s3CdnConfig);
        const houseService = new MongoHouseService();
        const generalDataService = new MongoGeneralDataService();
        const stateService = new MongoStateService(houseService, generalDataService);

        this.services = {
            cdnAdapter: cdn,
            houseService: houseService,
            generalDataService: generalDataService,
            adminService: new MongoAdminService(),
            imageService: new CdnImageService(cdn),
            stateService: stateService,
            siteUpdater: new CdnSiteUpdater(stateService, cdn),
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
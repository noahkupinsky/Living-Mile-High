import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { ServiceDict, SiteServiceManager } from "~/@types";
import { createInMemoryS3CdnConfig, inMemoryCDN } from "~/utils/createS3CdnService";
import * as Services from "~/services";

export class MockServiceManager implements SiteServiceManager {
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
        const cdn = new Services.S3CdnAdapter(s3CdnConfig);
        const houseService = new Services.MongoHouseService();
        const generalDataService = new Services.MongoGeneralDataService();
        const stateService = new Services.MongoStateService(houseService, generalDataService);

        this.services = {
            cdnAdapter: cdn,
            houseService: houseService,
            generalDataService: generalDataService,
            adminService: new Services.MongoAdminService(),
            imageService: new Services.CdnImageService(cdn),
            stateService: stateService,
            siteUpdater: new Services.CdnSiteUpdater(stateService, cdn),
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
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { S3Config, ServiceDict, SiteServiceManager } from "~/@types";
import { createInMemoryS3CdnConfig } from "~/utils/createS3CdnService";
import * as Services from "~/services";
import { inMemoryCdn } from "~/utils/inMemoryCdn";

export class MockServiceManager implements SiteServiceManager {
    private services?: ServiceDict;
    private mongoServer: MongoMemoryServer;
    private s3CdnConfig: S3Config;

    public async connect(): Promise<ServiceDict> {
        if (this.services) {
            return this.services;
        }

        this.mongoServer = await MongoMemoryServer.create();
        const mongoUri = this.mongoServer.getUri();
        await mongoose.connect(mongoUri, {});

        this.s3CdnConfig = await createInMemoryS3CdnConfig();

        const cdn = new Services.S3CdnAdapter(this.s3CdnConfig);
        const houseService = new Services.MongoHouseService();
        const generalDataService = new Services.MongoGeneralDataService();
        const stateService = new Services.MongoStateService(houseService, generalDataService);

        this.services = {
            cdnAdapter: cdn,
            houseService: houseService,
            generalDataService: generalDataService,
            adminService: new Services.MongoAdminService(),
            assetService: new Services.CdnAssetService(cdn),
            stateService: stateService,
            backupService: new Services.CdnBackupService(stateService, cdn),
            contactLogService: new Services.MongoContactLogService()
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
        Object.keys(inMemoryCdn).forEach(key => delete inMemoryCdn[key]);
    }
}
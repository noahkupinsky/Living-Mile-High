import mongoose from "mongoose";

import { ServiceDict, SiteServiceManager } from "~/@types";
import env from "~/config/env";
import { createNetworkS3CdnConfig } from "~/utils/createS3CdnService";
import * as Services from "~/services";

export class RealServiceManager implements SiteServiceManager {
    private services?: ServiceDict;

    public async connect(): Promise<ServiceDict> {
        if (this.services) {
            return this.services;
        }

        const { MONGODB_URI, CDN_KEY, CDN_SECRET, CDN_REGION, CDN_BUCKET, CDN_ENDPOINT } = env();
        await mongoose.connect(MONGODB_URI, {});
        const s3CdnConfig = createNetworkS3CdnConfig(
            {
                endpoint: CDN_ENDPOINT,
                region: CDN_REGION,
                bucket: CDN_BUCKET,
                key: CDN_KEY,
                secret: CDN_SECRET,
            }
        );
        const cdn = new Services.S3CdnAdapter(s3CdnConfig);
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
        }

        return this.services!;
    }

    public async disconnect(): Promise<void> {
        if (mongoose.connection) {
            await mongoose.connection.close();
        }
    }
}
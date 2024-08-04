import mongoose from "mongoose";

import { ServiceDict, SiteServiceManager } from "~/@types";
import env from "~/config/env";
import { createDORefreshCdnCache, createS3Config } from "~/utils/createS3CdnService";
import * as Services from "~/services";

export class RealServiceManager implements SiteServiceManager {
    private services?: ServiceDict;

    public async connect(): Promise<ServiceDict> {
        if (this.services) {
            return this.services;
        }

        const {
            MONGODB_URI,
            CDN_KEY,
            CDN_SECRET,
            CDN_REGION,
            CDN_BUCKET,
            CDN_ENDPOINT,
            NEXT_PUBLIC_CDN_URL,
            DO_API_TOKEN,
            DO_ENDPOINT_ID
        } = env();

        await mongoose.connect(MONGODB_URI, {});

        const refreshCdnCache = DO_API_TOKEN && DO_ENDPOINT_ID ? createDORefreshCdnCache(DO_API_TOKEN, DO_ENDPOINT_ID) : undefined;

        const s3CdnConfig = createS3Config(
            {
                endpoint: CDN_ENDPOINT,
                region: CDN_REGION,
                bucket: CDN_BUCKET,
                key: CDN_KEY,
                secret: CDN_SECRET,
                baseUrl: NEXT_PUBLIC_CDN_URL,
                refreshCache: refreshCdnCache
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
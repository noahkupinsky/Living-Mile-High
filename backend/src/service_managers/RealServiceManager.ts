import { ServiceDict, ServiceManager } from "../types";
import mongoose from "mongoose";
import env from "../config/env";
import { createNetworkS3CdnConfig } from "../utils/createS3CdnService";
import S3CdnAdapter from "../services/S3CdnAdapter";
import CdnImageService from "../services/CdnImageService";
import MongoAdminService from "../services/MongoAdminService";
import MongoHouseService from "../services/MongoHouseService";
import MongoGeneralDataService from "../services/MongoGeneralDataService";
import CdnSiteUpdater from "../services/CdnSiteUpdater";
import MongoStateService from "../services/MongoStateService";

class RealServiceManager implements ServiceManager<ServiceDict> {
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
    }
}

export default RealServiceManager
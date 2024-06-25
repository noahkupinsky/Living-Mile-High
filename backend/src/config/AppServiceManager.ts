import { AppServices, ServiceManager } from "../types";
import mongoose from "mongoose";
import env from "../config/env";
import { createNetworkS3CdnConfig } from "../utils/createS3CdnService";
import S3CdnAdapter from "../services/S3CdnAdapter";
import CdnAppDataService from "../services/CdnAppDataService";
import CdnImageService from "../services/CdnImageService";
import MongoAdminService from "../services/MongoAdminService";
import MongoHouseService from "../services/MongoHouseService";
import MongoOtherService from "src/services/MongoOtherService";

class AppServiceManager implements ServiceManager<AppServices> {
    private services?: AppServices;

    public async connect(): Promise<AppServices> {
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
    }
}

export default AppServiceManager
import AppServiceProvider from "../services/AppServiceProvider";
import MongoDatabase from "../services/database/MongoDatabase";
import env from './env'
import LocalAppServiceProvider from "../services/localServices/LocalAppServiceProvider";
import ServerServiceProvider from "../services/server/ServerServiceProvider";
import S3CdnServiceProvider from "../services/cdn/S3CdnServiceProvider";
import { createNetworkS3CdnConfig } from "../services/utils/createS3CdnService";
import { ServicesConfig } from "../types";

const createServices = async (config: ServicesConfig) => {
    const useLocal = config.useLocal ?? env('SERVICES') === 'local';

    if (useLocal) {
        return new LocalAppServiceProvider();
    } else {
        const database = new MongoDatabase(env('MONGODB_ATLAS_URI'));
        const s3CdnConfig = createNetworkS3CdnConfig(
            env('CDN_ENDPOINT'),
            env('CDN_REGION'),
            env('CDN_BUCKET'),
            env('CDN_KEY'),
            env('CDN_SECRET')
        );
        const cdnServiceProvider = new S3CdnServiceProvider(s3CdnConfig);
        const serverServiceProvider = new ServerServiceProvider();

        return new AppServiceProvider([cdnServiceProvider, database, serverServiceProvider]);
    }
}

export default createServices
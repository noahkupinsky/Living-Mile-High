import AppServiceProvider from "../services/AppServiceProvider";
import MongoDatabase from "../services/database/MongoDatabase";
import env from './env'
import LocalAppServiceProvider from "../services/localServices/LocalAppServiceProvider";
import ServerServiceProvider from "../services/server/ServerServiceProvider";
import S3CdnServiceProvider from "../services/cdn/S3CdnServiceProvider";
import { createDOSpaceS3CdnConfig } from "../services/utils/createS3CdnService";
import { ServicesConfig } from "../types";

const createServices = async (config: ServicesConfig) => {
    const { server } = config;
    const useLocal = config.useLocal ?? env('SERVICES') === 'local';

    if (useLocal) {
        return new LocalAppServiceProvider(server);
    } else {
        const database = new MongoDatabase(env('MONGODB_ATLAS_URI'));
        const s3CdnConfig = createDOSpaceS3CdnConfig(
            env('DO_SPACE_REGION'),
            env('DO_SPACE_BUCKET'),
            env('DO_SPACE_KEY'),
            env('DO_SPACE_SECRET')
        );
        const cdnServiceProvider = new S3CdnServiceProvider(s3CdnConfig);
        const serverServiceProvider = new ServerServiceProvider(server);

        return new AppServiceProvider([cdnServiceProvider, database, serverServiceProvider]);
    }
}

export default createServices
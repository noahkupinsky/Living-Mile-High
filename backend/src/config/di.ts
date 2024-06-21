import AppServices from "../services/appServices";
import MongoDatabase from "../services/database";
import { CdnImageService } from "../services/imageService";
import env from './env'
import LocalAppServices from "../services/localServices/LocalAppServices";
import { createInMemoryS3CdnServiceConfig, createDOSpaceS3CdnServiceConfig } from "../services/createS3CdnService";
import { S3CdnService } from "../services/S3CdnService";

const createServices = async () => {
    if (env('SERVICES') === 'local') {
        const localS3ServiceConfig = createInMemoryS3CdnServiceConfig();
        return new LocalAppServices(localS3ServiceConfig);
    } else {
        const database = new MongoDatabase(env('MONGODB_ATLAS_URI'));
        const s3ServiceConfig = createDOSpaceS3CdnServiceConfig(
            env('DO_SPACE_KEY'),
            env('DO_SPACE_SECRET'),
            env('DO_SPACE_REGION'),
            env('DO_SPACE_BUCKET')
        );
        const cdnService = new S3CdnService(s3ServiceConfig);
        const imageService = new CdnImageService(cdnService);

        return new AppServices(database, imageService);
    }
}

export default createServices
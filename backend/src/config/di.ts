import AppServices from "../services/AppServices";
import MongoDatabase from "../services/MongoDatabase";
import { CdnImageService } from "../services/CdnImageService";
import env from './env'
import LocalAppServices from "../services/localServices/LocalAppServices";
import { createInMemoryS3CdnConfig, createDOSpaceS3CdnConfig } from "../services/createS3CdnService";
import { S3CdnAdapter } from "../services/S3CdnAdapter";

const createServices = async () => {
    if (env('SERVICES') === 'local') {
        const localS3ServiceConfig = createInMemoryS3CdnConfig();
        return new LocalAppServices(localS3ServiceConfig);
    } else {
        const database = new MongoDatabase(env('MONGODB_ATLAS_URI'));
        const s3ServiceConfig = createDOSpaceS3CdnConfig(
            env('DO_SPACE_KEY'),
            env('DO_SPACE_SECRET'),
            env('DO_SPACE_REGION'),
            env('DO_SPACE_BUCKET')
        );
        const cdnService = new S3CdnAdapter(s3ServiceConfig);
        const imageService = new CdnImageService(cdnService);

        return new AppServices(database, imageService);
    }
}

export default createServices
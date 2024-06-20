import AppServices from "../services/appServices";
import MongoDatabase from "../services/database";
import { SpaceConfig, SpaceImageService } from "../services/imageService";
import env from './env'
import LocalAppServices from "../services/localServices/LocalAppServices";

const createServices = async () => {
    if (env('SERVICES') === 'local') {
        return new LocalAppServices();
    } else {
        const database = new MongoDatabase(env('MONGODB_ATLAS_URI'));
        const spaceConfig: SpaceConfig = {
            key: env('DO_SPACE_KEY'),
            secret: env('DO_SPACE_SECRET'),
            region: env('DO_SPACE_REGION'),
            bucket: env('DO_SPACE_BUCKET'),
        }
        const imageService = new SpaceImageService(spaceConfig);

        return new AppServices(database, imageService);
    }
}

export default createServices
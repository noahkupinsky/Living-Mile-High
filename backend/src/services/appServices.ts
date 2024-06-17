import { Database, IAppServices, ImageService, ServiceDict, ServiceKey } from "../@types";

class AppServices implements IAppServices {
    private database: Database;
    private imageService: ImageService;
    private services: ServiceDict;

    constructor(database: Database, imageService: ImageService) {
        this.database = database;
        this.imageService = imageService;
        this.services = {
            house: database.houseService,
            admin: database.adminService,
            image: imageService
        };
    }

    async connect(): Promise<void> {
        await this.database.connect();
    }

    async disconnect(): Promise<void> {
        await this.database.disconnect();
    }

    getService(key: ServiceKey): any {
        return this.services[key];
    }
}

export default AppServices;
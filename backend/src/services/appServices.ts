import { Database, IAppServices, ImageService, ServiceDict } from "../types";

class AppServices implements IAppServices {
    private database: Database;
    private imageService: ImageService;
    private serviceDict: ServiceDict;

    constructor(database: Database, imageService: ImageService) {
        this.database = database;
        this.imageService = imageService;
        this.serviceDict = {
            houseService: database.houseService,
            adminService: database.adminService,
            imageService: imageService
        };
    }

    async connect(): Promise<void> {
        await this.database.connect();
    }

    async disconnect(): Promise<void> {
        await this.database.disconnect();
    }

    get services(): ServiceDict {
        return this.serviceDict;
    }
}

export default AppServices;
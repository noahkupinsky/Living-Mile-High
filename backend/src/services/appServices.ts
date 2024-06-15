import { AdminService, Database, HouseService, IAppServices, ImageService } from "../@types";

class AppServices implements IAppServices {
    private appImageService: ImageService;
    private database: Database;

    constructor(database: Database, imageService: ImageService) {
        this.database = database;
        this.appImageService = imageService;
    }

    async connect(): Promise<void> {
        await this.database.connect();
        await this.appImageService.connect();
    }

    async disconnect(): Promise<void> {
        await this.database.disconnect();
        await this.appImageService.disconnect();
    }

    get imageService(): ImageService {
        return this.appImageService;
    }

    get adminService(): AdminService {
        return this.database.adminService;
    }

    get houseService(): HouseService {
        return this.database.houseService;
    }
}

export default AppServices;
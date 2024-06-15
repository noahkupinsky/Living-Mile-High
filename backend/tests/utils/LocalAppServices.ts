import { LocalDatabase } from "./LocalDatabase";
import { LocalImageService } from "./LocalImageService";
import { AdminService, HouseService, IAppServices, ImageService } from "src/@types";


class LocalAppServices implements IAppServices {
    protected appImageService: LocalImageService;
    protected database: LocalDatabase;

    constructor() {
        this.database = new LocalDatabase();
        this.appImageService = new LocalImageService();
    }

    async connect(): Promise<void> {
        await this.database.connect();
        await this.appImageService.connect();
    }

    async disconnect(): Promise<void> {
        await this.database.disconnect();
        await this.appImageService.disconnect();
    }

    async clear(): Promise<void> {
        await this.database.clear();
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

export default LocalAppServices;
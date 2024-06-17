import { LocalDatabase } from "./LocalDatabase";
import { LocalImageService } from "./LocalImageService";
import { IAppServices, ServiceDict, ServiceKey } from "src/@types";


class LocalAppServices implements IAppServices {
    private database: LocalDatabase;
    private imageService: LocalImageService;
    private services: ServiceDict;

    constructor() {
        this.database = new LocalDatabase();
        this.imageService = new LocalImageService();
        this.services = {
            house: this.database.houseService,
            admin: this.database.adminService,
            image: this.imageService
        };
    }

    async connect(): Promise<void> {
        await this.database.connect();
        await this.imageService.connect();
    }

    async disconnect(): Promise<void> {
        await this.database.disconnect();
        await this.imageService.disconnect();
    }

    async clear(): Promise<void> {
        await this.database.clear();
        await this.imageService.clear();
    }

    getService(key: ServiceKey): any {
        return this.services[key];
    }
}

export default LocalAppServices;
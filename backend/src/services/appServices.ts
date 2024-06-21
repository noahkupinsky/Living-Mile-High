import { CdnServiceProvider, Database, IAppServices, ImageService, AppServiceDict } from "../types";

class AppServices implements IAppServices {
    private database: Database;
    private cdnServiceProvider: CdnServiceProvider;
    private serviceDict: AppServiceDict;

    constructor(database: Database, cdnServiceProvider: CdnServiceProvider) {
        this.database = database;
        this.cdnServiceProvider = cdnServiceProvider;
        this.serviceDict = {
            ...database.services,
            ...cdnServiceProvider.services
        };
    }

    async connect(): Promise<void> {
        await this.database.connect();
    }

    async disconnect(): Promise<void> {
        await this.database.disconnect();
    }

    get services(): AppServiceDict {
        return this.serviceDict;
    }
}

export default AppServices;
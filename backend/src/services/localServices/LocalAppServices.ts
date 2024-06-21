import { CdnAdapter, IAppServices, AppServiceDict } from "../../types";
import LocalDatabase from "./LocalDatabase";
import { LocalCdnServiceProvider } from "./LocalCdnServiceProvider";


type LocalServiceDict = AppServiceDict & {
    cdnService: CdnAdapter
}


class LocalAppServices implements IAppServices {
    private database: LocalDatabase;
    private cdnServiceProvider: LocalCdnServiceProvider;
    private serviceDict: LocalServiceDict;

    constructor() {
        this.database = new LocalDatabase();
        this.cdnServiceProvider = new LocalCdnServiceProvider();
        this.serviceDict = {
            ...this.database.services,
            ...this.cdnServiceProvider.services,
        };
    }

    async connect(): Promise<void> {
        await this.database.connect();
    }

    async disconnect(): Promise<void> {
        await this.database.disconnect();
    }

    async clear(): Promise<void> {
        await this.database.clear();
        this.cdnServiceProvider.clear();
    }

    get services(): LocalServiceDict {
        return this.serviceDict;
    }
}

export default LocalAppServices;
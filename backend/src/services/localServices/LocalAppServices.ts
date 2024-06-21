import { CdnService, IAppServices, S3CdnConfig, ServiceDict } from "../../types";
import { inMemoryCDN } from "../createS3CdnService";
import LocalDatabase from "./LocalDatabase";
import { LocalCdnServiceProvider } from "./LocalCdnServiceProvider";


type LocalServiceDict = ServiceDict & {
    cdnService: CdnService
}


class LocalAppServices implements IAppServices {
    private database: LocalDatabase;
    private cdnServiceProvider: LocalCdnServiceProvider;
    private serviceDict: LocalServiceDict;

    constructor(S3ServiceConfig: S3CdnConfig) {
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
        for (const key in inMemoryCDN) {
            delete inMemoryCDN[key];
        }
    }

    get services(): LocalServiceDict {
        return this.serviceDict;
    }
}

export default LocalAppServices;
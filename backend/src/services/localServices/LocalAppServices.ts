import { S3CdnService, S3CdnServiceConfig } from "../S3CdnService";
import { inMemoryCDN } from "../createS3CdnService";
import { CdnImageService } from "../imageService";
import { LocalDatabase } from "./LocalDatabase";
import { CdnService, IAppServices, ImageService, ServiceDict } from "../../types";


type LocalServiceDict = ServiceDict & {
    cdnService: CdnService
}


class LocalAppServices implements IAppServices {
    private database: LocalDatabase;
    private imageService: ImageService;
    private serviceDict: LocalServiceDict;

    constructor(S3ServiceConfig: S3CdnServiceConfig) {
        this.database = new LocalDatabase();
        const s3Service = new S3CdnService(S3ServiceConfig);
        this.imageService = new CdnImageService(s3Service);
        this.serviceDict = {
            houseService: this.database.houseService,
            adminService: this.database.adminService,
            imageService: this.imageService,
            cdnService: s3Service
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
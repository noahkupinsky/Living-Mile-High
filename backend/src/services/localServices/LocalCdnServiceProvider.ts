import { S3Client } from "@aws-sdk/client-s3";
import { CdnAdapter, CdnServiceProvider } from "src/types";
import { CdnServiceDict } from "src/types/cdn";
import { CdnImageService } from "../CdnImageService";
import { S3CdnAdapter } from "../S3CdnAdapter";
import { createInMemoryS3CdnConfig, inMemoryCDN } from "../createS3CdnService";

type LocalCdnServiceDict = CdnServiceDict & {
    cdnService: CdnAdapter
}

export class LocalCdnServiceProvider implements CdnServiceProvider {
    private s3Client: S3Client;
    private cdnService: CdnAdapter;
    private serviceDict: LocalCdnServiceDict;

    constructor() {
        const s3ServiceConfig = createInMemoryS3CdnConfig();
        this.s3Client = s3ServiceConfig.client;
        this.cdnService = new S3CdnAdapter(s3ServiceConfig);
        this.serviceDict = {
            imageService: new CdnImageService(this.cdnService),
            cdnService: this.cdnService
        };
    }

    clear(): void {
        for (const key in inMemoryCDN) {
            delete inMemoryCDN[key];
        }
    }

    get services(): LocalCdnServiceDict {
        return this.serviceDict;
    }
}
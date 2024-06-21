import { S3Client } from "@aws-sdk/client-s3";
import { CdnService, CdnServiceProvider } from "src/types";
import { CdnServiceDict } from "src/types/cdn";
import { CdnImageService } from "../CdnImageService";
import { S3CdnService } from "../S3CdnService";
import { createInMemoryS3CdnServiceConfig } from "../createS3CdnService";

type LocalCdnServiceDict = CdnServiceDict & {
    cdnService: CdnService
}

export class LocalCdnServiceProvider implements CdnServiceProvider {
    private s3Client: S3Client;
    private cdnService: CdnService;
    private serviceDict: LocalCdnServiceDict;

    constructor() {
        const s3ServiceConfig = createInMemoryS3CdnServiceConfig();
        this.s3Client = s3ServiceConfig.client;
        this.cdnService = new S3CdnService(s3ServiceConfig);
        this.serviceDict = {
            imageService: new CdnImageService(this.cdnService),
            cdnService: this.cdnService
        };
    }

    get services(): LocalCdnServiceDict {
        return this.serviceDict;
    }
}
import { S3Client } from "@aws-sdk/client-s3";
import { CdnService, CdnServiceDict, CdnServiceProvider, S3CdnConfig } from "../types";
import { CdnImageService } from "./CdnImageService";
import { S3CdnService } from "./S3CdnService";

export class S3CdnServiceProvider implements CdnServiceProvider {
    private s3Client: S3Client;
    private cdnService: CdnService;
    private serviceDict: CdnServiceDict;

    constructor(s3CdnConfig: S3CdnConfig) {
        this.s3Client = s3CdnConfig.client;
        this.cdnService = new S3CdnService(s3CdnConfig);
        this.serviceDict = {
            imageService: new CdnImageService(this.cdnService)
        };
    }

    get services(): CdnServiceDict {
        return this.serviceDict;
    }
}
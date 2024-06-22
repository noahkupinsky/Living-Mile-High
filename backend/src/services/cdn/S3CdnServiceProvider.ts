import { S3Client } from "@aws-sdk/client-s3";
import { CdnAdapter, CdnServiceDict, CdnServiceProvider, S3CdnConfig } from "../../types";
import CdnImageService from "./CdnImageService";
import S3CdnAdapter from "./S3CdnAdapter";
import CdnAppDataService from "./CdnAppDataService";

class S3CdnServiceProvider implements CdnServiceProvider {
    private s3Client: S3Client;
    private cdn: CdnAdapter;
    private serviceDict: CdnServiceDict;

    constructor(s3CdnConfig: S3CdnConfig) {
        this.s3Client = s3CdnConfig.client;
        this.cdn = new S3CdnAdapter(s3CdnConfig);
        this.serviceDict = {
            imageService: new CdnImageService(this.cdn),
            appDataService: new CdnAppDataService(this.cdn)
        };
    }

    async connect(): Promise<void> {
        // nothing yet
    }

    async disconnect(): Promise<void> {
        // nothing yet
    }

    get services(): CdnServiceDict {
        return this.serviceDict;
    }
}

export default S3CdnServiceProvider
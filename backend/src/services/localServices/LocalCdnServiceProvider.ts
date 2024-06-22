import { S3Client } from "@aws-sdk/client-s3";
import { CdnAdapter, CdnServiceDict, LocalServiceProvider } from "src/types";
import CdnImageService from "../cdn/CdnImageService";
import S3CdnAdapter from "../cdn/S3CdnAdapter";
import { createInMemoryS3CdnConfig, inMemoryCDN } from "../utils/createS3CdnService";
import CdnAppDataService from "../cdn/CdnAppDataService";
import { LocalServiceProviderBase } from "../utils/ServiceProviderBase";

export type LocalCdnServiceDict = CdnServiceDict & {
    cdn: CdnAdapter
}

export class LocalCdnServiceProvider extends LocalServiceProviderBase<LocalCdnServiceDict> implements LocalServiceProvider<LocalCdnServiceDict> {
    constructor() {
        const s3ServiceConfig = createInMemoryS3CdnConfig();
        const cdn = new S3CdnAdapter(s3ServiceConfig);
        super({
            imageService: new CdnImageService(cdn),
            appDataService: new CdnAppDataService(cdn),
            cdn: cdn
        });
    }

    async clear(): Promise<void> {
        for (const key in inMemoryCDN) {
            delete inMemoryCDN[key];
        }
    }
}
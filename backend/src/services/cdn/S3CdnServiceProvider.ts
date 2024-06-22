import { CdnServiceDict, CdnServiceProvider, S3CdnConfig } from "../../types";
import CdnImageService from "./CdnImageService";
import S3CdnAdapter from "./S3CdnAdapter";
import CdnAppDataService from "./CdnAppDataService";
import { ServiceProviderBase } from "../utils/ServiceProviderBase";

class S3CdnServiceProvider extends ServiceProviderBase<CdnServiceDict> implements CdnServiceProvider {
    constructor(s3CdnConfig: S3CdnConfig) {
        const cdn = new S3CdnAdapter(s3CdnConfig);
        super({
            imageService: new CdnImageService(cdn),
            appDataService: new CdnAppDataService(cdn)
        });
    }
}

export default S3CdnServiceProvider
import { Request, Response, NextFunction } from 'express';
export {
    HouseRecord,
    GeneralDataRecord,
    GeneralData
} from './database'
export {
    HouseService,
    AdminService,
    GeneralDataService,
    StateService
} from './dbServices'
export {
    ServiceManager,
    ServiceDict,
    SiteServiceManager,
} from './otherServices'
export {
    BackupMetadata,
    Backup,
    BackupService,
    CdnMetadata,
    CdnContent,
    PutCommand,
    CdnAdapter,
    S3Config,
    AssetService as ImageService,
} from './cdnServices'

export type ExpressMiddleware<
    Req = Request,
    Res = Response
> = (
    req: Req,
    res: Res,
    next: NextFunction
) => any;

export type ExpressEndpoint<
    Req = Request,
    Res = Response
> = (
    req: Req,
    res: Res
) => any;

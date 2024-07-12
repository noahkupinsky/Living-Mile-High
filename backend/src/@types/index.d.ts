import { Request, Response, NextFunction } from 'express';
export {
    HouseRecord,
    GeneralDataRecord,
    GeneralData
} from './database'
export {
    ServiceManager,
    ServiceDict,
    SiteServiceManager,
    CdnAdapter,
    S3Config,
    ImageService,
    HouseService,
    AdminService,
    GeneralDataService,
    StateService,
    BackupService,
    CdnMetadata,
    PutCommand,
    CdnContent,
} from './services'

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

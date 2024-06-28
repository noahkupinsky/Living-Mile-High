import { Request, Response, NextFunction } from 'express';
export {
    AdminRecord,
    HouseRecord,
    GeneralDataRecord,
    GeneralData
} from './database'
export {
    ServiceManager,
    ServiceDict,
    CdnAdapter,
    S3Config,
    ImageService,
    HouseService,
    AdminService,
    AppDataService,
    GeneralDataService
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

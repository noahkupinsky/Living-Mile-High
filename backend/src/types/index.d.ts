import { Request, Response, NextFunction } from 'express';
export {
    AdminRecord,
    HouseRecord,
    OtherRecord,
    OtherData
} from './database'
export {
    ServiceManager,
    AppServices,
    CdnAdapter,
    S3Config,
    ImageService,
    HouseService,
    AdminService,
    AppDataService,
    OtherService
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

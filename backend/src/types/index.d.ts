export { AdminRecord, HouseRecord } from './database'
export {
    ServiceManager,
    AssetPrefix,
    AppServices,
    CdnAdapter,
    S3Config,
    ImageService,
    HouseService,
    AdminService,
    AppDataService
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

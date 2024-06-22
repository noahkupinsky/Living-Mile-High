import { ServerServiceProvider, CdnServiceProvider, Database, AppServiceProvider } from "../types";
import ServiceProviderTree from "./utils/ServiceProviderTree";

class AppServiceProviderImpl extends ServiceProviderTree<
    [CdnServiceProvider, Database, ServerServiceProvider]
> implements AppServiceProvider { }

export default AppServiceProviderImpl;
import { ServerServiceProvider, CdnServiceProvider, Database, IAppServiceProvider } from "../types";
import LocalServerServiceProviderImpl from "./localServices/LocalServerServiceProvider";
import ServerServiceProviderImpl from "./server/ServerServiceProvider";
import ServiceProviderTree from "./utils/ServiceProviderTree";

class AppServiceProvider extends ServiceProviderTree<
    [CdnServiceProvider, Database, ServerServiceProvider]
> implements IAppServiceProvider { }

export default AppServiceProvider;
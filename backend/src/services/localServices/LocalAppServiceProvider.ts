import { IAppServiceProvider, LocalServiceProvider } from "../../types";
import LocalDatabase from "./LocalDatabase";
import { LocalCdnServiceProvider } from "./LocalCdnServiceProvider";
import ServiceProviderTree from "../utils/ServiceProviderTree";
import { CompoundServiceDict } from "src/types/serviceProvider";
import LocalServerServiceProvider from "./LocalServerServiceProvider";
import { Server as HTTPServer } from "http";

class LocalServiceProviderTree<

    T extends LocalServiceProvider<any>[],
    D = {},
    S = CompoundServiceDict<T, D>

> extends ServiceProviderTree<T, D, S> {

    async clear(): Promise<void> {
        for (const provider of this.providers) {
            await provider.clear();
        }
    }
}


class LocalAppServiceProvider extends LocalServiceProviderTree<

    [LocalCdnServiceProvider, LocalDatabase, LocalServerServiceProvider]

> implements IAppServiceProvider {
    constructor(server: HTTPServer) {
        super([new LocalCdnServiceProvider(), new LocalDatabase(), new LocalServerServiceProvider(server)]);
    }
}

export default LocalAppServiceProvider;
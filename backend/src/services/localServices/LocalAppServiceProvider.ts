import { AppServiceProvider, LocalServiceProvider } from "../../types";
import LocalDatabase from "./LocalDatabase";
import { LocalCdnServiceProvider } from "./LocalCdnServiceProvider";
import ServiceProviderTree from "../utils/ServiceProviderTree";
import { CompoundServiceDict } from "src/types/serviceProvider";
import LocalServerServiceProvider from "./LocalServerServiceProvider";

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

> implements AppServiceProvider {
    constructor() {
        super([new LocalCdnServiceProvider(), new LocalDatabase(), new LocalServerServiceProvider()]);
    }
}

export default LocalAppServiceProvider;
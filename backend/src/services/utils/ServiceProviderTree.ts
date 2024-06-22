import { ServiceProvider } from "src/types";
import { CompoundServiceDict } from "src/types/serviceProvider";

class ServiceProviderTree<
    T extends ServiceProvider<any>[],
    D = {},
    S = CompoundServiceDict<T, D>
> implements ServiceProvider<S> {
    protected serviceDict: D;
    protected providers: T;

    constructor(providers: T, serviceDict: D = {} as D) {
        this.serviceDict = serviceDict;
        this.providers = providers;
    }

    async connect(): Promise<void> {
        await Promise.all(this.providers.map(provider => provider.connect()));
    }

    async disconnect(): Promise<void> {
        await Promise.all(this.providers.map(provider => provider.disconnect()));
    }

    get services(): S {
        const providerServices = this.providers.map(provider => provider.services);
        const flattenedServices = Object.assign({}, this.serviceDict, ...providerServices) as S;

        return flattenedServices;
    }
}

export default ServiceProviderTree
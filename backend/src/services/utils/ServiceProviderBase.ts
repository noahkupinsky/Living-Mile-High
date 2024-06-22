import { LocalServiceProvider, ServiceProvider } from "../../types";

export class ServiceProviderBase<D> implements ServiceProvider<D> {
    protected serviceDict: D;

    constructor(serviceDict: D) {
        this.serviceDict = serviceDict;
    }

    async connect(): Promise<void> {
        // nothing yet
    }

    async disconnect(): Promise<void> {
        // nothing yet
    }

    get services(): D {
        return this.serviceDict;
    }
}

export class LocalServiceProviderBase<D> extends ServiceProviderBase<D> implements LocalServiceProvider<D> {
    async clear(): Promise<void> {
        // nothing yet
    }
}
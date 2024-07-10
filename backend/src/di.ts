import { ServiceDict, SiteServiceManager } from "~/@types";
import { MockServiceManager } from "~/service_managers/MockServiceManager";
import { RealServiceManager } from "~/service_managers/RealServiceManager";

let serviceManager: SiteServiceManager;
let serviceDict: ServiceDict;

export async function connectServices(mock: boolean): Promise<void> {
    serviceManager = mock ? new MockServiceManager() : new RealServiceManager();

    serviceDict = await serviceManager.connect();
}

export function services(): ServiceDict {
    if (!serviceManager) {
        throw new Error('services not initialized yet');
    }
    return serviceDict;
}

export function getServiceManager(): SiteServiceManager {
    if (!serviceManager) {
        throw new Error('services not initialized yet');
    }
    return serviceManager;
}
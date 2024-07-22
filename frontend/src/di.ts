import * as Services from './services';

let serviceDict: {
    apiService: Services.ApiService,
    updateService: Services.UpdateService,
    cdnService: Services.CdnService
}

const services = () => {
    if (!serviceDict) {
        const updateService = new Services.UpdateService();
        serviceDict = {
            apiService: new Services.ApiService(updateService.injectEventId),
            updateService: updateService,
            cdnService: new Services.CdnService()
        };
    }
    return serviceDict;
}

export default services;
import * as Services from './services';

let serviceDict: {
    apiService: Services.ApiService,
    updateService: Services.UpdateService,
    cdnService: Services.CdnService
}

const services = () => {
    if (!serviceDict) {
        serviceDict = {
            apiService: new Services.ApiService(),
            updateService: new Services.UpdateService(),
            cdnService: new Services.CdnService()
        };
    }
    return serviceDict;
}

export default services;
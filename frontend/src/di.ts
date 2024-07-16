import * as Services from './services';

let serviceDict: {
    apiService: Services.ApiService,
    sseService: Services.SseService,
    cdnService: Services.CdnService
}

const services = () => {
    if (!serviceDict) {
        serviceDict = {
            apiService: new Services.ApiService(),
            sseService: new Services.SseService(),
            cdnService: new Services.CdnService()
        };
    }
    return serviceDict;
}

export default services;
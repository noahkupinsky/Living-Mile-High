import * as Services from './services';

let serviceDict: {
    apiService: Services.ApiService,
    eventService: Services.EventService,
    cdnService: Services.CdnService
}

const services = () => {
    if (!serviceDict) {
        serviceDict = {
            apiService: new Services.ApiService(),
            eventService: new Services.EventService(),
            cdnService: new Services.CdnService()
        };
    }
    return serviceDict;
}

export default services;
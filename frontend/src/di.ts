import * as Services from './services';

let serviceDict: {
    apiService: Services.ApiService,
    eventService: Services.EventService,
    cdnService: Services.CdnService
}

const services = () => {
    if (!serviceDict) {
        const eventService = new Services.EventService();
        serviceDict = {
            apiService: new Services.ApiService(eventService.injectEventId),
            eventService: eventService,
            cdnService: new Services.CdnService()
        };
    }
    return serviceDict;
}

export default services;
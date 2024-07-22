import { generateEventId } from 'living-mile-high-lib';
import * as Services from './services';

let serviceDict: {
    apiService: Services.ApiService,
    eventService: Services.EventService,
    cdnService: Services.CdnService
}

const services = () => {
    if (!serviceDict) {
        const localEventId = generateEventId();
        serviceDict = {
            apiService: new Services.ApiService(localEventId),
            eventService: new Services.EventService(localEventId),
            cdnService: new Services.CdnService()
        };
    }
    return serviceDict;
}

export default services;
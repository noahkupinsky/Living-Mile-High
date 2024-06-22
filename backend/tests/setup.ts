import dotenv from 'dotenv';
import { getServer, setupApp, teardown } from '../src/app';
import LocalAppServiceProvider from '../src/services/localServices/LocalAppServiceProvider';
import createServices from '../src/config/di';

dotenv.config();

let localServices: LocalAppServiceProvider;

beforeAll(async () => {
    const servicesConfig = {
        useLocal: true,
        server: getServer()
    }

    localServices = await createServices(servicesConfig) as LocalAppServiceProvider;
    await setupApp(localServices);
});

beforeEach(async () => {
    await localServices.clear();
});

afterAll(async () => {
    await teardown();
});

export const services = () => localServices.services;
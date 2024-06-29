import dotenv from 'dotenv';
import { getServer, setupApp, teardown } from '../src/app';
import newServiceManager from '../src/config/di';
import MockServiceManager from '../src/service_managers/MockServiceManager';

dotenv.config();
let MockSM: MockServiceManager;

beforeAll(async () => {
    MockSM = newServiceManager(true) as MockServiceManager;
    await setupApp(MockSM);
});

beforeEach(async () => {
    await MockSM.clear();
});

afterAll(async () => {
    await teardown();
});
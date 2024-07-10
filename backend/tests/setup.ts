import dotenv from 'dotenv';
import { setupApp, teardown } from '~/app';
import { getServiceManager } from '~/di';

dotenv.config();

beforeAll(async () => {
    await setupApp(true);
});

beforeEach(async () => {
    const mockServiceManager = getServiceManager() as any;
    await mockServiceManager.clear();
});

afterAll(async () => {
    await teardown();
});
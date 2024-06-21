import dotenv from 'dotenv';
import { createApp, getApp, teardown } from '../src/app';
import supertest from 'supertest';
import LocalAppServices from '../src/services/localServices/LocalAppServices';
import { createInMemoryS3CdnServiceConfig } from '../src/services/createS3CdnService';

dotenv.config();

let localServices: LocalAppServices;
let s3CdnClient: any;

beforeAll(async () => {
    const localS3ServiceConfig = createInMemoryS3CdnServiceConfig();
    s3CdnClient = localS3ServiceConfig.client;
    localServices = new LocalAppServices(localS3ServiceConfig);
    await createApp(localServices);
});

beforeEach(async () => {
    await localServices.clear();
});

afterAll(async () => {
    await teardown();
});

export const services = () => localServices.services;
export const s3Client = () => s3CdnClient;
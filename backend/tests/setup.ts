import dotenv from 'dotenv';
import { createApp, getApp, teardown } from '../src/app';
import supertest from 'supertest';
import LocalAppServices from '../src/services/localServices/LocalAppServices';
import { createInMemoryS3CdnConfig } from '../src/services/createS3CdnService';

dotenv.config();

let localServices: LocalAppServices;

beforeAll(async () => {
    localServices = new LocalAppServices();
    await createApp(localServices);
});

beforeEach(async () => {
    await localServices.clear();
});

afterAll(async () => {
    await teardown();
});

export const services = () => localServices.services;
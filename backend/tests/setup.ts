import dotenv from 'dotenv';
import { Server } from 'http';
import { createApp, getApp, teardown } from '../src/app';
import express from 'express';
import supertest from 'supertest';
import LocalAppServices from '../src/services/localServices/LocalAppServices';

dotenv.config();

const TEST_PORT = 3001;

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

export const getRequest = () => supertest(getApp());
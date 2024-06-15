import { createApp } from '../../src/app';
import supertest from "supertest";
import { AppConfig, Database } from "../../src/@types";
import { Server } from "http";

export async function teardown(database: Database, server: Server) {
    await database.disconnect();
    if (server) {
        server.close();
    }
}


import { AppConfig, Database } from "@/@types";
import createApp from "@/app";
import { Server } from "http";
import supertest from "supertest";

export async function setupTestServer(appConfig: AppConfig) {
    const app = await createApp(appConfig);
    const request = supertest(app);
    const listener = (port: number) => {
        return app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    };
    return { app, request, listener };
}

export async function teardown(database: Database, server: Server) {
    await database.disconnect();
    if (server) {
        server.close();
    }
}


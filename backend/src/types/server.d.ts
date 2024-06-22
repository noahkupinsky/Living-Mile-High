import { ServiceProvider } from "./serviceProvider";

export interface WebSocketService {
    broadcast(message: any): void;
}

export type ServerServiceDict = {
    webSocketService: WebSocketService
}

export type ServerServiceProvider = ServiceProvider<ServerServiceDict>
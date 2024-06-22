import { ServerServiceDict, ServerServiceProvider } from "../../types";
import { Server as HTTPServer } from "http";
import WebSocketServiceImpl from './WebSocketService';
import { ServiceProviderBase } from "../utils/ServiceProviderBase";

class ServerServiceProviderImpl extends ServiceProviderBase<ServerServiceDict> implements ServerServiceProvider {
    constructor(server: HTTPServer) {
        super({
            webSocketService: new WebSocketServiceImpl(server)
        });
    }
}

export default ServerServiceProviderImpl
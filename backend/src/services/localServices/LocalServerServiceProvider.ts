import { ServerServiceDict, ServerServiceProvider } from "src/types";
import { LocalServiceProviderBase } from "../utils/ServiceProviderBase";
import WebSocketService from "../server/WebSocketService";
import { Server as HTTPServer } from "http";

class LocalServerServiceProviderImpl extends LocalServiceProviderBase<ServerServiceDict> implements ServerServiceProvider {
    constructor(server: HTTPServer) {
        super({
            webSocketService: new WebSocketService(server)
        });
    }
}

export default LocalServerServiceProviderImpl
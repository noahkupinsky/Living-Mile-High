import { ServerServiceDict, ServerServiceProvider } from "src/types";
import { LocalServiceProviderBase } from "../utils/ServiceProviderBase";
import WebSocketService from "../server/WebSocketService";
import { getServer } from "../../app";

const server = getServer();

class LocalServerServiceProviderImpl extends LocalServiceProviderBase<ServerServiceDict> implements ServerServiceProvider {
    constructor() {
        super({
            webSocketService: new WebSocketService(server)
        });
    }
}

export default LocalServerServiceProviderImpl
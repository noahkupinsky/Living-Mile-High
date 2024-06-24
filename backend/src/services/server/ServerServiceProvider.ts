import { ServerServiceDict, ServerServiceProvider } from "../../types";
import WebSocketServiceImpl from './WebSocketService';
import { ServiceProviderBase } from "../utils/ServiceProviderBase";
import { getServer } from "../../app";

const server = getServer();

class ServerServiceProviderImpl extends ServiceProviderBase<ServerServiceDict> implements ServerServiceProvider {
    constructor() {
        super({
            webSocketService: new WebSocketServiceImpl(server)
        });
    }
}

export default ServerServiceProviderImpl
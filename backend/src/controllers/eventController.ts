import { EventMessage } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { formatEventMessage } from "~/utils/misc";

let clients: any = [];

export const connectToEvents: ExpressEndpoint = (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const connectedMessage = formatEventMessage(EventMessage.CONNECTED);

    res.write(connectedMessage);

    const clientId = Date.now();


    const newClient = {
        id: clientId,
        res
    };

    clients.push(newClient);

    req.on('close', () => {
        clients = clients.filter((client: any) => client.id !== clientId);
    });
};

export const sendEventMessage = (message: EventMessage) => {
    clients.forEach((client: any) => {
        const formattedMessage = formatEventMessage(message);
        client.res.write(formattedMessage);
    });
}
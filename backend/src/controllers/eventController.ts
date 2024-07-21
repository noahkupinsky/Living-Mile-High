import { EventMessage } from "living-mile-high-lib";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { formatEventMessage } from "~/utils/misc";

let clients: Map<number, WebSocket> = new Map();
let nextClientId = 0;

export const setupWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server, path: "/events" });

    wss.on('connection', (ws: WebSocket) => {

        const clientId = nextClientId++;
        clients.set(clientId, ws);

        const connectedMessage = formatEventMessage(EventMessage.CONNECTED);
        ws.send(connectedMessage);

        ws.on('close', () => {
            clients.delete(clientId);
        });
    });
};

export const sendEventMessage = (message: EventMessage, eventId?: string) => {
    const formattedMessage = formatEventMessage(message, eventId);
    clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(formattedMessage);
        }
    });
};
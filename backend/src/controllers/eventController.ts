import { EventMessage, generateEventId } from "living-mile-high-lib";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

let clients: Map<number, WebSocket> = new Map();
let nextClientId = 0;

export const setupWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server, path: "/events" });

    wss.on('connection', (ws: WebSocket) => {

        const clientId = nextClientId++;
        clients.set(clientId, ws);

        const connectedMessage = createEventObjectString([EventMessage.CONNECTED]);
        ws.send(connectedMessage);

        ws.on('close', () => {
            clients.delete(clientId);
        });
    });
};

export const sendSiteAndBackupsUpdatedEvent = (eventId?: string) => {
    sendEvent([EventMessage.SITE_UPDATED, EventMessage.BACKUPS_UPDATED], eventId);
}

export const sendBackupsUpdatedEvent = (eventId?: string) => {
    sendEvent([EventMessage.BACKUPS_UPDATED], eventId);
}

export const sendEvent = (messages: EventMessage[], eventId?: string) => {
    const formattedMessage = createEventObjectString(messages, eventId);
    clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(formattedMessage);
        }
    });
};

export function createEventObjectString(message: EventMessage[], eventId?: string): string {
    const eventObject = {
        messages: message,
        eventId: (eventId || generateEventId())
    }
    return JSON.stringify(eventObject);
}
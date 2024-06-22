import { WebSocketService } from "src/types";
import { WebSocket, Server as WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';

class WebSocketServiceImpl implements WebSocketService {
    private wss: WebSocketServer;

    constructor(server: HTTPServer) {
        this.wss = new WebSocketServer({ server });

        this.wss.on('connection', (ws: WebSocketServer) => {
            console.log('New client connected');

            ws.on('message', (message: string) => {
                console.log('received: %s', message);
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    public broadcast(data: string) {
        this.wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === client.OPEN) {
                client.send(data);
            }
        });
    }
}

export default WebSocketServiceImpl;
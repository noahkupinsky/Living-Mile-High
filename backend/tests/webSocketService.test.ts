import http from 'http';
import { WebSocketService } from '../src/types';
import WebSocket from 'ws';
import WebSocketServiceImpl from '../src/services/server/WebSocketService';

describe('WebSocketService', () => {
    let server: http.Server;
    let wsService: WebSocketService;
    let client: WebSocket;

    beforeEach((done) => {
        // Create HTTP server and WebSocket service
        const app = (req: http.IncomingMessage, res: http.ServerResponse) => res.end();
        server = http.createServer(app);
        wsService = new WebSocketServiceImpl(server);

        // Start server but don't listen on a port
        server.listen(() => {
            // Create WebSocket client connected to the server
            const address = server.address() as { port: number };
            client = new WebSocket(`ws://localhost:${address.port}`);
            client.on('open', () => done());
        });
    });

    afterEach((done) => {
        client.close();
        server.close(done);
    });

    test('should receive message from WebSocket service', (done) => {
        const testMessage = 'Hello WebSocket';

        client.on('message', (message) => {
            expect(message.toString()).toBe(testMessage);
            done();
        });

        wsService.broadcast(testMessage);
    });
});
import WebSocket from 'ws';
import { EventMessage } from "living-mile-high-lib";
import { startListening, stopListening } from "./utils";
import { sendEventMessage } from "~/controllers/eventController";
import { formatEventMessage } from '~/utils/misc';

let url: string;

beforeAll(async () => {
    url = await startListening();
});

afterAll(async () => {
    await stopListening();
});

const createWebSocketTimeout = (done: any, ws: WebSocket) => {
    const timeout = setTimeout(() => {
        done(new Error('onmessage event not triggered within the expected time'));
        ws.close();
    }, 5000);
    return timeout;
};

function handleWebSocketMessages(
    ws: WebSocket,
    done: (error?: Error) => void,
    timeout: NodeJS.Timeout,
    onMessage: (data: any, close: () => void) => void
) {
    ws.onmessage = (event) => {
        try {
            const close = () => {
                clearTimeout(timeout);
                ws.close();
                done();
            };
            onMessage(event.data, close);
        } catch (error: any) {
            done(error);
            ws.close();
        }
    };

    ws.onerror = (error: any) => {
        clearTimeout(timeout);
        ws.close();
        done(error);
    };
}

describe('WebSocket /events/connect', () => {
    it('should keep the connection open and send initial message', (done) => {
        const ws = new WebSocket(`${url}/events`);

        const timeout = createWebSocketTimeout(done, ws);

        handleWebSocketMessages(
            ws,
            done,
            timeout,
            (data: any, close) => {
                expect(data).toEqual(formatEventMessage(EventMessage.CONNECTED));
                close();
            }
        );
    });

    it('should send event messages', (done) => {
        const ws = new WebSocket(`${url}/events`);

        let receivedInitialMessage = false;

        const timeout = createWebSocketTimeout(done, ws);

        handleWebSocketMessages(
            ws,
            done,
            timeout,
            (data: any, close) => {
                if (!receivedInitialMessage) {
                    expect(data).toBe(formatEventMessage(EventMessage.CONNECTED));
                    receivedInitialMessage = true;

                    // Send the custom event message after receiving the initial message
                    sendEventMessage(EventMessage.SITE_UPDATED, 'test-event-id');
                } else {
                    expect(data).toEqual(formatEventMessage(EventMessage.SITE_UPDATED, 'test-event-id'));
                    close();
                }
            }
        );
    });
});
import EventSource from "eventsource";
import { EventMessage } from "living-mile-high-lib";
import { startListening, stopListening } from "./utils";
import { sendEventMessage } from "~/controllers/eventController";

let url: string;

beforeAll(async () => {
    url = await startListening();
});

afterAll(async () => {
    await stopListening();
});

const createEventSourceTimeout = (done: any, eventSource: EventSource) => {
    const timeout = setTimeout(() => {
        done(new Error('onmessage event not triggered within the expected time'));
        eventSource.close();
    }, 5000);
    return timeout;
}

function handleEventSourceMessages(
    eventSource: EventSource,
    done: (error?: Error) => void,
    timeout: NodeJS.Timeout,
    onMessage: (data: any, close: () => void) => void
) {
    eventSource.onmessage = (event) => {
        try {
            const close = () => {
                clearTimeout(timeout);
                eventSource.close();
                done();
            };
            onMessage(event.data, close);
        } catch (error: any) {
            done(error);
            eventSource.close();
        }
    };

    eventSource.onerror = (error: any) => {
        clearTimeout(timeout);
        eventSource.close();
        done(error);
    };
}

describe('GET /events/connect', () => {
    it('should keep the connection open and send initial message', (done) => {
        const eventSource = new EventSource(`${url}/events/connect`);

        const timeout = createEventSourceTimeout(done, eventSource);

        handleEventSourceMessages(
            eventSource,
            done,
            timeout,
            (data: any, close) => {
                expect(data).toEqual(EventMessage.CONNECTED);
                close();
            }
        )
    });

    it('should send event messages', (done) => {
        const eventSource = new EventSource(`${url}/events/connect`);

        let receivedInitialMessage = false;

        const timeout = createEventSourceTimeout(done, eventSource);

        handleEventSourceMessages(
            eventSource,
            done,
            timeout,
            (data: any, close) => {
                if (!receivedInitialMessage) {
                    expect(data).toBe(EventMessage.CONNECTED);
                    receivedInitialMessage = true;

                    // Send the custom event message after receiving the initial message
                    sendEventMessage(EventMessage.SITE_UPDATED);
                } else {
                    expect(data).toEqual(EventMessage.SITE_UPDATED);
                    close();
                }
            }
        );
    });
});
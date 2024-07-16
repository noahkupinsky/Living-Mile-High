import { EventHandler } from '@/types';
import { env } from 'next-runtime-env';

const backend_url = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class SseService {
    private eventSource: EventSource | null = null;
    private eventHandlers: EventHandler[] = [];

    backendRouteToUrl(route: string): string {
        return `${backend_url()}/${route}`;
    }

    connectToSSE() {
        if (!this.eventSource) {
            const connectUrl = this.backendRouteToUrl('events/connect');
            this.eventSource = new EventSource(connectUrl);
            this.eventSource.onmessage = (event) => {
                this.eventHandlers.forEach(handler => handler(event.data));
            };
            this.eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                this.eventSource!.close();
                this.eventSource = null; // Reset the event source so it can be recreated
            };
        }
    }

    addEventHandler(handler: EventHandler) {
        this.eventHandlers.push(handler);
        this.connectToSSE();
    }

    removeEventHandler(handler: EventHandler) {
        this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    }
}
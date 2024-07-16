'use client';

import { SseHandler } from '@/types';
import { env } from 'next-runtime-env';

const backend_url = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class SseService {
    private eventSource: EventSource | null = null;
    private eventHandlers: SseHandler[] = [];

    private getConnectUrl() {
        return `${backend_url()}/events/connect`;
    }

    connectToSSE() {
        if (!this.eventSource) {
            this.eventSource = new EventSource(this.getConnectUrl());
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

    addEventHandler(handler: SseHandler) {
        this.eventHandlers.push(handler);
        this.connectToSSE();
    }

    removeEventHandler(handler: SseHandler) {
        this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    }
}
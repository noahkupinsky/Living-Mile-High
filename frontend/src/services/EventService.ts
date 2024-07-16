'use client';

import { SiteEventHandler } from '@/types';
import { env } from 'next-runtime-env';

const backendUrl = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class EventService {
    private websocket: WebSocket | null = null;
    private eventHandlers: SiteEventHandler[] = [];

    private getConnectUrl() {
        const url = backendUrl();
        if (url.startsWith('https')) {
            return url.replace('https', 'wss') + '/events';
        } else {
            return url.replace('http', 'ws') + '/events';
        }
    }

    private createWebSocket(url: string): WebSocket {
        return new WebSocket(url);
    }

    connectToEvents() {
        if (!this.websocket) {
            this.websocket = this.createWebSocket(this.getConnectUrl());
            this.websocket.onmessage = (event) => {
                const eventObject = JSON.parse(event.data);
                this.eventHandlers.forEach(handler => handler(eventObject));
            };
            this.websocket.onerror = (error) => {
                console.error('WebSocket failed:', error);
                this.websocket!.close();
                this.websocket = null; // Reset the websocket so it can be recreated
            };
            this.websocket.onclose = () => {
                this.websocket = null; // Reset the websocket so it can be recreated
            };
        }
    }

    addEventHandler(handler: SiteEventHandler) {
        this.eventHandlers.push(handler);
        this.connectToEvents();
    }

    removeEventHandler(handler: SiteEventHandler) {
        this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    }
}
'use client';

import { EventIdInjector, SiteUpdateHandler, SiteUpdater } from '@/types';
import { EventMessage, EventObject, generateEventId } from 'living-mile-high-lib';
import { env } from 'next-runtime-env';

const backendUrl = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class UpdateService {
    private websocket: WebSocket | null = null;
    private siteUpdater: SiteUpdater | null = null;
    private updateHandlers: SiteUpdateHandler[] = [];
    private expectedEventIds: string[] = [];

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

            this.websocket.onmessage = async (event) => {
                const { message, eventId }: EventObject = JSON.parse(event.data);
                const isLocal = this.checkLocalAndConsumeEvent(eventId);

                if (message === EventMessage.SITE_UPDATED && this.siteUpdater) {
                    const siteData = await this.siteUpdater();
                    // create a 1 second delay to allow the site to update
                    setTimeout(() => {
                        this.updateHandlers.map(handler => handler(isLocal, siteData));
                    }, 50)
                }
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

    private checkLocalAndConsumeEvent(eventId: string): boolean {
        const isLocal = this.expectedEventIds.includes(eventId);
        if (isLocal) {
            this.expectedEventIds = this.expectedEventIds.filter(id => id !== eventId);
        }
        return isLocal;
    }

    injectEventId: EventIdInjector = async (fn) => {
        const eventId = generateEventId();
        this.expectedEventIds.push(eventId);
        try {
            return await fn(eventId);
        } catch (error) {
            this.expectedEventIds = this.expectedEventIds.filter(id => id !== eventId);
            throw error;
        }
    }

    setSiteUpdater(siteUpdater: SiteUpdater) {
        this.siteUpdater = siteUpdater;
    }

    unsetSiteUpdater() {
        this.siteUpdater = null;
    }

    addUpdateHandler(handler: SiteUpdateHandler) {
        this.updateHandlers.push(handler);
        this.connectToEvents();
    }

    removeUpdateHandler(handler: SiteUpdateHandler) {
        this.updateHandlers = this.updateHandlers.filter(h => h !== handler);
    }
}
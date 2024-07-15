import { EventHandler } from '@/types';
import axios, { AxiosInstance } from 'axios';
import { CdnFixedKey } from 'living-mile-high-lib';
import { env } from 'next-runtime-env';

const backend_url = () => env('NEXT_PUBLIC_BACKEND_URL')!;
const cdn_url = () => env('NEXT_PUBLIC_CDN_URL')!;

type AxiosInstances = {
    backend: AxiosInstance;
    cdn: AxiosInstance;
}

class BackendProvider {
    static instance: BackendProvider | null = null;
    static eventSource: EventSource | null = null;
    static eventHandlers: EventHandler[] = [];
    static axiosInstances: AxiosInstances | null = null;

    static getInstance() {
        if (!BackendProvider.instance) {
            BackendProvider.instance = new BackendProvider();
        }
        return BackendProvider.instance;
    }

    backendRouteToUrl(route: string) {
        return `${backend_url()}/${route}`;
    }

    cdnKeyToUrl(key: string) {
        return `${cdn_url()}/${key}`
    }

    axios(): AxiosInstances {
        if (!BackendProvider.axiosInstances) {
            const backendAxios = axios.create({
                baseURL: backend_url(),
                withCredentials: true
            });
            const cdnAxios = axios.create({
                baseURL: cdn_url(),
            });
            BackendProvider.axiosInstances = {
                backend: backendAxios,
                cdn: cdnAxios
            };
        }

        return BackendProvider.axiosInstances;
    }

    connectToSSE() {
        if (!BackendProvider.eventSource) {
            const connect_url = this.backendRouteToUrl('events/connect');
            BackendProvider.eventSource = new EventSource(connect_url);
            BackendProvider.eventSource.onmessage = (event) => {
                BackendProvider.eventHandlers.forEach(handler => handler(event.data));
            };
            BackendProvider.eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                BackendProvider.eventSource!.close();
                BackendProvider.eventSource = null; // Reset the event source so it can be recreated
            };
        }
    }

    addEventHandler(handler: EventHandler) {
        BackendProvider.eventHandlers.push(handler);
        this.connectToSSE();
    }

    removeEventHandler(handler: EventHandler) {
        BackendProvider.eventHandlers = BackendProvider.eventHandlers.filter(h => h !== handler);
    }

    async fetchSiteData() {
        try {
            const response = await this.axios().cdn.get(CdnFixedKey.SITE_DATA);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch site data:', error);
            throw error;
        }
    }

    async verifyAuthenticated() {
        try {
            const response = await this.axios().backend.get('api/auth/verify');
            return response.status === 200;
        } catch (error) {
            console.error('Failed to verify authentication:', error);
            return false;
        }
    }

    async login(username: string, password: string) {
        try {
            const response = await this.axios().backend.post('api/auth/login', { username, password });
            return response.status === 200;
        } catch (error) {
            console.error('Failed to login:', error);
            return false;
        }
    }
}

export default BackendProvider.getInstance();
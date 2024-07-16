'use client';

import axios, { AxiosInstance } from 'axios';
import { env } from 'next-runtime-env';

const backendUrl = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class ApiService {
    private backendAxios: AxiosInstance;

    constructor() {
        this.backendAxios = axios.create({
            baseURL: `${backendUrl()}/api`,
            withCredentials: true
        });
    }

    backendRouteToUrl(route: string): string {
        return `${backendUrl()}/${route}`;
    }

    async verifyAuthenticated() {
        try {
            const response = await this.backendAxios.get('auth/verify');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async login(username: string, password: string) {
        try {
            const response = await this.backendAxios.post('auth/login', { username, password });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}
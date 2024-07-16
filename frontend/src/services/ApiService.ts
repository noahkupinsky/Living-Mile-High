import axios, { AxiosInstance } from 'axios';
import { env } from 'next-runtime-env';

const backend_url = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class ApiService {
    private backendAxios: AxiosInstance;

    constructor() {
        this.backendAxios = axios.create({
            baseURL: backend_url(),
            withCredentials: true
        });
    }

    backendRouteToUrl(route: string): string {
        return `${backend_url()}/${route}`;
    }

    async verifyAuthenticated() {
        try {
            const response = await this.backendAxios.get('api/auth/verify');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async login(username: string, password: string) {
        try {
            const response = await this.backendAxios.post('api/auth/login', { username, password });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}
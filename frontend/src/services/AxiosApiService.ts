import { ApiService } from "@/types";
import axios, { AxiosInstance } from "axios";

class AxiosApiService implements ApiService {
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: `${apiUrl}/api`,
            withCredentials: true
        });
    }
    async fetch(route: string, params: Record<string, any> = {}): Promise<any> {
        const response = await this.axiosInstance.get(route, { params });
        return response.data;
    }
    async verifyAuthenticated(): Promise<boolean> {
        const response = await this.axiosInstance.get('/auth/verify');
        return response.status === 200;
    }
    async login(username: string, password: string): Promise<boolean> {
        const response = await this.axiosInstance.post('/auth/login', { username, password });
        return response.status === 200;
    }
}

export default AxiosApiService
import axios from 'axios';
import { env } from 'next-runtime-env';

const API_URL = env('NEXT_PUBLIC_API_HOST');

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    if (config.url?.startsWith('/api')) {
        config.url = `${API_URL}${config.url}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
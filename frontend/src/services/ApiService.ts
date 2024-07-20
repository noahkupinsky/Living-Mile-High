'use client';

import axios, { AxiosInstance } from 'axios';
import { BackupIndex, DeepPartial, GeneralData, House } from 'living-mile-high-lib';
import { env } from 'next-runtime-env';

const backendUrl = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: `${backendUrl()}/api`,
            withCredentials: true
        });
    }

    backendRouteToUrl(route: string): string {
        return `${backendUrl()}/${route}`;
    }

    async uploadImage(image: ArrayBuffer): Promise<string> {
        try {
            const response = await this.api.post('image/upload', { image });
            if (response.status === 200) {
                return response.data.imageUrl;
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            throw error;
        }
    }

    async updateGeneralData(data: DeepPartial<GeneralData>) {
        try {
            const response = await this.api.post('general/update', { data });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async upsertHouse(house: DeepPartial<House>): Promise<string> {
        try {
            const response = await this.api.post('house/upsert', { house });
            if (response.status === 200) {
                return response.data.id;
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteHouse(id: string): Promise<void> {
        try {
            const response = await this.api.post('house/delete', { id });
            const success = response.status === 200 && response.data.success;
            if (!success) {
                throw new Error('Failed to delete house');
            }
        } catch (error) {
            throw error;
        }
    }

    async restoreBackup(key: string) {
        try {
            const response = await this.api.post('backup/restore', { key });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async deleteBackup(key: string) {
        try {
            const response = await this.api.post(`backup/delete`, { key });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async createBackup(name: string) {
        try {
            const response = await this.api.post('backup/create', { name });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async getBackupIndices(): Promise<BackupIndex[]> {
        try {
            const response = await this.api.get('backup');
            const indices: BackupIndex[] = response.data;
            // sort by most recent date
            const sortedIndices = indices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return sortedIndices;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async renameBackup(key: string, name: string) {
        try {
            const response = await this.api.post('backup/rename', { key, name });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async verifyAuthenticated() {
        try {
            const response = await this.api.get('auth/verify');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async login(username: string, password: string) {
        try {
            const response = await this.api.post('auth/login', { username, password });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}
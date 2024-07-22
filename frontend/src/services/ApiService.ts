'use client';

import { EventIdInjector } from '@/types';
import axios, { AxiosInstance } from 'axios';
import {
    BackupIndex,
    DeepPartial,
    GeneralData,
    House,
    CreateBackupRequest,
    CreateBackupResponse,
    DeleteBackupRequest,
    DeleteBackupResponse,
    DeleteHouseRequest,
    DeleteHouseResponse,
    GetBackupIndicesResponse,
    LoginRequest,
    RenameBackupRequest,
    RenameBackupResponse,
    RestoreBackupRequest,
    RestoreBackupResponse,
    UpdateGeneralDataRequest,
    UpdateGeneralDataResponse,
    UploadAssetResponse,
    UpsertHouseRequest,
    UpsertHouseResponse,
    VerifyResponse,
    createUploadAssetRequest,
    PruneSiteResponse
} from 'living-mile-high-lib';
import { env } from 'next-runtime-env';

const backendUrl = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class ApiService {
    private apiAxios: AxiosInstance;
    private injectEventId: EventIdInjector;

    constructor(injectEventId: EventIdInjector) {
        this.apiAxios = axios.create({
            baseURL: `${backendUrl()}/api`,
            withCredentials: true
        });

        this.injectEventId = injectEventId;
    }

    backendRouteToUrl(route: string): string {
        return `${backendUrl()}/${route}`;
    }

    async uploadAsset(file: File): Promise<string> {
        const formData = createUploadAssetRequest(file);

        const response = await this.apiAxios.post('asset/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const resBody: UploadAssetResponse = response.data;

        if (response.status === 200) {
            return resBody.url!;
        } else {
            throw new Error('Failed to upload asset');
        }
    }

    async pruneSiteData(): Promise<void> {
        const response = await this.apiAxios.post('prune');
        const resBody: PruneSiteResponse = response.data;

        if (response.status === 200 && resBody.success) {
            return;
        } else {
            throw new Error(resBody.error);
        }
    }

    async updateGeneralData(data: DeepPartial<GeneralData>): Promise<void> {
        return await this.injectEventId(async eventId => {
            const req: UpdateGeneralDataRequest = { data, eventId };
            const response = await this.apiAxios.post('general/update', req);
            const resBody: UpdateGeneralDataResponse = response.data;

            if (response.status === 200 && resBody.success) {
                return;
            } else {
                throw new Error(resBody.error);
            }
        });
    }

    async upsertHouse(house: DeepPartial<House>): Promise<string> {
        return await this.injectEventId(async eventId => {
            const req: UpsertHouseRequest = { house, eventId };
            const response = await this.apiAxios.post('house/upsert', req);
            const resBody: UpsertHouseResponse = response.data;

            if (response.status === 200 && resBody.success) {
                return resBody.id!;
            } else {
                throw new Error(resBody.error);
            }
        });
    }

    async deleteHouse(id: string): Promise<void> {
        return await this.injectEventId(async eventId => {
            const req: DeleteHouseRequest = { id, eventId };
            const response = await this.apiAxios.post('house/delete', req);
            const resBody: DeleteHouseResponse = response.data;

            if (response.status === 200 && resBody.success) {
                return;
            } else {
                throw new Error(resBody.error);
            }
        });
    }

    async restoreBackup(key: string): Promise<void> {
        return await this.injectEventId(async eventId => {
            const req: RestoreBackupRequest = { key, eventId };
            const response = await this.apiAxios.post('backup/restore', req);
            const resBody: RestoreBackupResponse = response.data;

            if (response.status === 200 && resBody.success) {
                return;
            } else {
                throw new Error(resBody.error);
            }
        });
    }

    async deleteBackup(key: string): Promise<void> {
        const req: DeleteBackupRequest = { key };
        const response = await this.apiAxios.post('backup/delete', req);
        const resBody: DeleteBackupResponse = response.data;

        if (response.status === 200 && resBody.success) {
            return;
        } else {
            throw new Error(resBody.error);
        }
    }

    async createBackup(name: string): Promise<void> {
        const req: CreateBackupRequest = { name };
        const response = await this.apiAxios.post('backup/create', req);
        const resBody: CreateBackupResponse = response.data;

        if (response.status === 200 && resBody.success) {
            return;
        } else {
            throw new Error(resBody.error);
        }
    }

    async getBackupIndices(): Promise<BackupIndex[]> {
        const response = await this.apiAxios.get('backup');
        const resBody: GetBackupIndicesResponse = response.data;

        if (response.status === 200 && resBody.success) {
            const indices: BackupIndex[] = resBody.indices!;
            // sort by most recent date
            const sortedIndices = indices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return sortedIndices;
        } else {
            throw new Error(resBody.error);
        }
    }

    async renameBackup(key: string, name: string): Promise<void> {
        const req: RenameBackupRequest = { key, name };
        const response = await this.apiAxios.post('backup/rename', req);
        const resBody: RenameBackupResponse = response.data;

        if (response.status === 200 && resBody.success) {
            return;
        } else {
            throw new Error(resBody.error);
        }
    }

    async verifyAuthenticated(): Promise<boolean> {
        try {
            const response = await this.apiAxios.get('auth/verify');
            const resBody: VerifyResponse = response.data;

            return (response.status === 200 && resBody.success);
        } catch (error) {
            return false;
        }
    }

    async login(username: string, password: string): Promise<boolean> {
        try {
            const req: LoginRequest = { username, password };
            const response = await this.apiAxios.post('auth/login', req);

            return (response.status === 200);
        } catch (error) {
            return false;
        }
    }
}
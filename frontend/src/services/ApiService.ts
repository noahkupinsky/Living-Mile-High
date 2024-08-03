'use client';
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
    PruneSiteResponse,
    PruneSiteRequest
} from 'living-mile-high-lib';
import { env } from 'next-runtime-env';

const backendUrl = () => env('NEXT_PUBLIC_BACKEND_URL')!;

export class ApiService {
    private apiAxios: AxiosInstance;
    private localEventId: string;

    constructor(localEventId: string) {
        this.apiAxios = axios.create({
            baseURL: `${backendUrl()}/api`,
            withCredentials: true,
        });

        this.localEventId = localEventId;
    }

    backendRouteToUrl(route: string): string {
        return `${backendUrl()}/${route}`;
    }

    async uploadAsset(file: File): Promise<string> {
        const formData = createUploadAssetRequest(file);

        const response = await this.apiAxios.post('asset/upload', formData, {
            headers: {
                ...formData.getHeaders(),
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
        const req: PruneSiteRequest = { eventId: this.localEventId };
        const response = await this.apiAxios.post('prune', req);
        const resBody: PruneSiteResponse = response.data;

        if (response.status !== 200 || !resBody.success) {
            throw new Error(resBody.error);
        }
    }

    async updateGeneralData(data: DeepPartial<GeneralData>): Promise<void> {
        const req: UpdateGeneralDataRequest = { data, eventId: this.localEventId };
        const response = await this.apiAxios.post('general/update', req);
        const resBody: UpdateGeneralDataResponse = response.data;

        if (response.status !== 200 || !resBody.success) {
            throw new Error(resBody.error);
        }
    }

    async upsertHouse(house: DeepPartial<House>): Promise<string> {
        const req: UpsertHouseRequest = { house, eventId: this.localEventId };
        const response = await this.apiAxios.post('house/upsert', req);
        const resBody: UpsertHouseResponse = response.data;

        if (response.status === 200 && resBody.success) {
            return resBody.id!;
        } else {
            throw new Error(resBody.error);
        }
    }

    async deleteHouse(id: string): Promise<void> {
        const req: DeleteHouseRequest = { id, eventId: this.localEventId };
        const response = await this.apiAxios.post('house/delete', req);
        const resBody: DeleteHouseResponse = response.data;

        if (response.status !== 200 || !resBody.success) {
            throw new Error(resBody.error);
        }
    }

    async restoreBackup(key: string): Promise<void> {
        const req: RestoreBackupRequest = { key, eventId: this.localEventId };
        const response = await this.apiAxios.post('backup/restore', req);
        const resBody: RestoreBackupResponse = response.data;

        if (response.status !== 200 || !resBody.success) {
            throw new Error(resBody.error);
        }
    }

    async deleteBackup(key: string): Promise<void> {
        const req: DeleteBackupRequest = { key, eventId: this.localEventId };
        const response = await this.apiAxios.post('backup/delete', req);
        const resBody: DeleteBackupResponse = response.data;

        if (response.status !== 200 || !resBody.success) {
            throw new Error(resBody.error);
        }
    }

    async createBackup(name: string): Promise<void> {
        const req: CreateBackupRequest = { name, eventId: this.localEventId };
        const response = await this.apiAxios.post('backup/create', req);
        const resBody: CreateBackupResponse = response.data;

        if (response.status !== 200 || !resBody.success) {
            throw new Error(resBody.error);
        }
    }

    async getBackupIndices(): Promise<BackupIndex[]> {
        const response = await this.apiAxios.get('backup');
        const resBody: GetBackupIndicesResponse = response.data;

        if (response.status === 200 && resBody.success) {
            return resBody.indices!;
        } else {
            throw new Error(resBody.error);
        }
    }

    async renameBackup(key: string, name: string): Promise<void> {
        const req: RenameBackupRequest = { key, name, eventId: this.localEventId };
        const response = await this.apiAxios.post('backup/rename', req);
        const resBody: RenameBackupResponse = response.data;

        if (response.status !== 200 || !resBody.success) {
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
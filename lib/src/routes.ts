import { randomUUID } from "crypto";
import { BackupIndex, DeepPartial, GeneralData, House } from "./types";

export type SuccessResponse = {
    success: boolean;
    error?: string;
}

export type SiteUpdateRequest = {
    siteUpdateId?: string;
}

export type SiteUpdateResponse = {
    siteUpdateId: string;
}

export function generateSiteUpdateId(siteUpdateId?: string): string {
    return siteUpdateId ? siteUpdateId : randomUUID();
}

// AUTH

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    message: string;
};

// verify request sends cookie not form body

export type VerifyResponse = {
    success: boolean;
};

// BACKUPS

// getBackupIndices has no request
export type GetBackupIndicesResponse = SuccessResponse & {
    indices?: BackupIndex[];
};

export type GetBackupResponse = SuccessResponse;

export type CreateBackupRequest = {
    name: string;
};

export type CreateBackupResponse = SuccessResponse;

export type DeleteBackupRequest = {
    key: string;
};

export type DeleteBackupResponse = SuccessResponse;

export type RenameBackupRequest = {
    key: string;
    name: string;
};

export type RenameBackupResponse = SuccessResponse;

export type RestoreBackupRequest = SiteUpdateRequest & {
    key: string;
};

export type RestoreBackupResponse = SiteUpdateResponse & SuccessResponse;


// HOUSES

export type UpsertHouseRequest = SiteUpdateRequest & {
    house: DeepPartial<House>;
};

export type UpsertHouseResponse = SiteUpdateResponse & SuccessResponse & {
    id?: string;
};

export type DeleteHouseRequest = SiteUpdateRequest & {
    id: string;
};

export type DeleteHouseResponse = SiteUpdateResponse & SuccessResponse;


// GENERAL DATA

export type UpdateGeneralDataRequest = SiteUpdateRequest & {
    data: DeepPartial<GeneralData>;
};

export type UpdateGeneralDataResponse = SiteUpdateResponse & SuccessResponse;

// IMAGE

export function createUploadAssetRequest(file: File, siteUpdateId?: string): FormData {
    const formData = new FormData();
    formData.append('file', file);
    if (siteUpdateId) {
        formData.append('siteUpdateId', siteUpdateId);
    }
    return formData;
}

export type UploadAssetResponse = SiteUpdateResponse & SuccessResponse & {
    url?: string;
};
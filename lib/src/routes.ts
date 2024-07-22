import { v4 as uuidv4 } from "uuid";
import { BackupIndex, DeepPartial, GeneralData, House } from "./types";
import { EventMessage } from "./defaults";

export type SuccessResponse = {
    success: boolean;
    error?: string;
}

export type SiteUpdateRequest = {
    eventId?: string;
}

export function generateEventId(eventId?: string): string {
    return eventId ? eventId : uuidv4();
}

export type EventObject = {
    message: EventMessage;
    eventId: string;
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

export type BackupResponse = SuccessResponse & {
    indices?: BackupIndex[];
};

// getBackupIndices has no request
export type GetBackupIndicesResponse = SuccessResponse & {
    indices?: BackupIndex[];
};

export type GetBackupResponse = BackupResponse;

export type CreateBackupRequest = {
    name: string;
};

export type CreateBackupResponse = BackupResponse;

export type DeleteBackupRequest = {
    key: string;
};

export type DeleteBackupResponse = BackupResponse;

export type RenameBackupRequest = {
    key: string;
    name: string;
};

export type RenameBackupResponse = BackupResponse;

export type RestoreBackupRequest = SiteUpdateRequest & {
    key: string;
};

export type RestoreBackupResponse = BackupResponse;


// HOUSES

export type UpsertHouseRequest = SiteUpdateRequest & {
    house: DeepPartial<House>;
};

export type UpsertHouseResponse = SuccessResponse & {
    id?: string;
};

export type DeleteHouseRequest = SiteUpdateRequest & {
    id: string;
};

export type DeleteHouseResponse = SuccessResponse;


// GENERAL DATA

export type UpdateGeneralDataRequest = SiteUpdateRequest & {
    data: DeepPartial<GeneralData>;
};

export type UpdateGeneralDataResponse = SuccessResponse;

// IMAGE

export function createUploadAssetRequest(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
}

export type UploadAssetResponse = SuccessResponse & {
    url?: string;
};

// PRUNE

// is a get route - has no req body
export type PruneSiteResponse = BackupResponse;
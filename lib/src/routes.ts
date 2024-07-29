import { v4 as uuidv4 } from "uuid";
import { BackupIndex, DeepPartial, GeneralData, House } from "./types";
import { EventMessage } from "./defaults";
import FormData from "form-data";

export type SuccessResponse = {
    success: boolean;
    error?: string;
}

export type EventRequest = {
    eventId?: string;
}

export function generateEventId(eventId?: string): string {
    return eventId ? eventId : uuidv4();
}

export type EventObject = {
    messages: EventMessage[];
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

// getBackupIndices has no request
export type GetBackupIndicesResponse = SuccessResponse & {
    indices?: BackupIndex[];
};

export type CreateBackupRequest = EventRequest & {
    name: string;
};

export type CreateBackupResponse = SuccessResponse;

export type DeleteBackupRequest = EventRequest & {
    key: string;
};

export type DeleteBackupResponse = SuccessResponse;

export type RenameBackupRequest = EventRequest & {
    key: string;
    name: string;
};

export type RenameBackupResponse = SuccessResponse;

export type RestoreBackupRequest = EventRequest & {
    key: string;
};

export type RestoreBackupResponse = SuccessResponse;


// HOUSES

export type UpsertHouseRequest = EventRequest & {
    house: DeepPartial<House>;
};

export type UpsertHouseResponse = SuccessResponse & {
    id?: string;
};

export type DeleteHouseRequest = EventRequest & {
    id: string;
};

export type DeleteHouseResponse = SuccessResponse;


// GENERAL DATA

export type UpdateGeneralDataRequest = EventRequest & {
    data: DeepPartial<GeneralData>;
};

export type UpdateGeneralDataResponse = SuccessResponse;

// IMAGE

export function createUploadAssetRequest(file: any): FormData {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
}

export type UploadAssetResponse = SuccessResponse & {
    url?: string;
};

// PRUNE

export type PruneSiteRequest = EventRequest;

export type PruneSiteResponse = SuccessResponse;
import { BackupIndex, DeepPartial, GeneralData, House } from "./types";

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

export type SuccessResponse = {
    success: boolean;
    error?: string;
}

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

export type RestoreBackupRequest = {
    key: string;
};

export type RestoreBackupResponse = SuccessResponse;


// HOUSES

export type UpsertHouseRequest = {
    house: DeepPartial<House>;
};

export type UpsertHouseResponse = SuccessResponse & {
    id?: string;
};

export type DeleteHouseRequest = {
    id: string;
};

export type DeleteHouseResponse = SuccessResponse;


// GENERAL DATA

export type UpdateGeneralDataRequest = {
    data: DeepPartial<GeneralData>;
};

export type UpdateGeneralDataResponse = SuccessResponse;

// IMAGE

//image upload request sends form data field "image" which then gets put into req.file

export type UploadAssetResponse = SuccessResponse & {
    url?: string;
};
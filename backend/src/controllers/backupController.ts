import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateSite } from "./updateController";
import { CreateBackupRequest, CreateBackupResponse, DeleteBackupRequest, DeleteBackupResponse, generateEventId, GetBackupIndicesResponse, RenameBackupRequest, RenameBackupResponse, RestoreBackupRequest, RestoreBackupResponse } from "living-mile-high-lib";

const backupService = () => services().backupService;

export const getBackupIndices: ExpressEndpoint = async (req, res) => {
    try {
        const indices = await backupService().getBackupIndices();

        const successResponse: GetBackupIndicesResponse = { success: true, indices };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: GetBackupIndicesResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}

export const createManualBackup: ExpressEndpoint = async (req, res) => {
    const body: CreateBackupRequest = req.body;
    const { name } = body;

    try {
        await backupService().createManualBackup(name);

        const successResponse: CreateBackupResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: CreateBackupResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}

export const deleteManualBackup: ExpressEndpoint = async (req, res) => {
    const body: DeleteBackupRequest = req.body;
    const { key } = body;

    try {
        await backupService().deleteManualBackup(key);

        const successResponse: DeleteBackupResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: DeleteBackupResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}

export const renameManualBackup: ExpressEndpoint = async (req, res) => {
    const body: RenameBackupRequest = req.body;
    const { key, name } = body;

    try {
        await backupService().renameManualBackup(key, name);

        const successResponse: RenameBackupResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: RenameBackupResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}

export const restoreBackup: ExpressEndpoint = async (req, res) => {
    const body: RestoreBackupRequest = req.body;
    const { key, eventId } = body;

    try {
        await backupService().restoreBackup(key);
        await updateSite(eventId);

        const successResponse: RestoreBackupResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: RestoreBackupResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}

// INTERMEDIATE, NOT A ROUTE

export const createPruneConsolidateAutoBackups = async () => {
    await backupService().createAutoBackup();
    await backupService().pruneAutoBackups();
    await backupService().consolidateAutoBackups();
}

/**
 * Why do we need to prune before we consolidate?
 * Suppose our base is N backups, and we have exactly N backups,
 * with the oldest one being expired and the other N - 1 valid
 * If you prune then consolidate, you lose the oldest backup
 * If you consolidate then prune, you lose all but most recent backup
 */
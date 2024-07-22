import { EventMessage, PruneSiteResponse } from "living-mile-high-lib";
import { pruneAssets, updateFixedKeys } from "./cdnController";
import { sendEventMessage } from "./eventController";
import { services } from "~/di";
import { ExpressEndpoint } from "~/@types";

const backupService = () => services().backupService;

// INTERMEDIATE, NOT A ROUTE

export async function updateSite(eventId?: string) {
    await updateFixedKeys();
    await backupService().createAutoBackup();
    sendEventMessage(EventMessage.SITE_UPDATED, eventId);
}

export const pruneSite: ExpressEndpoint = async (req, res) => {
    try {
        await backupService().pruneAutoBackups();
        await backupService().consolidateAutoBackups();
        await pruneAssets();
        const indices = await backupService().getBackupIndices();

        const successResponse: PruneSiteResponse = { success: true, indices: indices };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: PruneSiteResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}

/**
 * Why do we need to prune before we consolidate?
 * Suppose our base is N backups, and we have exactly N backups,
 * with the oldest one being expired and the other N - 1 valid
 * If you prune then consolidate, you lose the oldest backup
 * If you consolidate then prune, you lose all but most recent backup
 */
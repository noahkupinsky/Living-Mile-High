import { PruneSiteRequest, PruneSiteResponse } from "living-mile-high-lib";
import { pruneAssets, updateFixedKeys } from "./cdnController";
import { sendBackupsUpdatedEvent, sendSiteAndBackupsUpdatedEvent } from "./eventController";
import { services } from "~/di";
import { ExpressEndpoint } from "~/@types";

const backupService = () => services().backupService;
const cdnAdapter = () => services().cdnAdapter;

// INTERMEDIATE, NOT A ROUTE

export async function updateSite(eventId?: string) {
    await updateFixedKeys();
    await backupService().createAutoBackup();
    await cdnAdapter().refreshCache();
    sendSiteAndBackupsUpdatedEvent(eventId);
}

export async function updateBackups(eventId?: string) {
    await cdnAdapter().refreshCache();
    sendBackupsUpdatedEvent(eventId);
}

export const pruneSite: ExpressEndpoint = async (req, res) => {
    const body: PruneSiteRequest = req.body;
    const { eventId } = body;

    try {
        await backupService().pruneAutoBackups();
        await backupService().consolidateAutoBackups();
        await pruneAssets();
        updateBackups(eventId);

        const successResponse: PruneSiteResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: PruneSiteResponse = { success: false, error: error.message };
        console.log(error);
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
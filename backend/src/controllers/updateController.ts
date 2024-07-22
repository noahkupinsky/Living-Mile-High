import { EventMessage } from "living-mile-high-lib";
import { createPruneConsolidateAutoBackups } from "./backupController";
import { pruneAssets, updateFixedKeys } from "./cdnController";
import { sendEventMessage } from "./eventController";

// INTERMEDIATE, NOT A ROUTE

export async function updateSite(eventId?: string) {
    await updateFixedKeys();
    await createPruneConsolidateAutoBackups();
    await pruneAssets();
    sendEventMessage(EventMessage.SITE_UPDATED, eventId);
}
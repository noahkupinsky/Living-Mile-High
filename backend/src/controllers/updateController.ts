import { EventMessage } from "living-mile-high-lib";
import { createAutoBackup } from "./backupController";
import { pruneCdn, updateFixedKeys } from "./cdnController";
import { sendEventMessage } from "./eventController";

// INTERMEDIATE, NOT A ROUTE

export async function updateSite() {
    await updateFixedKeys();
    await createAutoBackup();
    await pruneCdn();
    sendEventMessage(EventMessage.SITE_UPDATED);
}
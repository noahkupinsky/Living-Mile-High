import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateSite } from "./updateController";

const backupService = () => services().backupService;

export const getBackupIndices: ExpressEndpoint = async (req, res) => {
    try {
        const indices = await backupService().getBackupIndices();
        res.status(200).json(indices);
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const createManualBackup: ExpressEndpoint = async (req, res) => {
    const { name } = req.body;

    try {
        await backupService().createManualBackup(name);
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }

}

export const deleteManualBackup: ExpressEndpoint = async (req, res) => {
    const { key } = req.body;

    try {
        await backupService().deleteManualBackup(key);
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const renameManualBackup: ExpressEndpoint = async (req, res) => {
    const { key, name } = req.body;

    try {
        await backupService().renameManualBackup(key, name);
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const restoreBackup: ExpressEndpoint = async (req, res) => {
    const { key } = req.body;

    try {
        await backupService().restoreBackup(key);
        await updateSite();
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
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
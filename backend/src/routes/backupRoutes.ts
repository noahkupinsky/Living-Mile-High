import { Router } from "express";
import { restoreBackup, createManualBackup, deleteManualBackup, getBackupIndices, renameManualBackup } from "~/controllers/backupController";

const router = Router();

router.get('/', getBackupIndices);

router.post('/restore', restoreBackup);

router.post('/create/', createManualBackup);

router.post('/rename/', renameManualBackup);

router.post('/delete/', deleteManualBackup);

export default router
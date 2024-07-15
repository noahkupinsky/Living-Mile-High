import { Router } from "express";
import { updateGeneralData } from "~/controllers/generalDataController";

const router = Router();

router.post('/update', updateGeneralData);

export default router;
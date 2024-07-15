import { Router } from "express";
import { connectToEvents } from "~/controllers/eventController";

const router = Router();

router.get('/connect', connectToEvents);

export default router;
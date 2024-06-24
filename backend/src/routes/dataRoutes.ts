import { Router } from 'express';
import { garbageCollect, updateAppData } from '../controllers/dataController';

const router = Router();

router.post('/update', updateAppData);
router.delete('/garbageCollect', garbageCollect);

export default router
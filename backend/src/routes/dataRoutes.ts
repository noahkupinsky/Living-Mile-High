import { Router } from 'express';
import { updateAppData } from '../controllers/dataController';

const router = Router();

router.post('/update', updateAppData);

export default router
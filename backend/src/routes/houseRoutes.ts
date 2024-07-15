import { Router } from 'express';
import { upsertHouse } from '~/controllers/houseController';

const router = Router();

router.post('/upsert', upsertHouse);

export default router
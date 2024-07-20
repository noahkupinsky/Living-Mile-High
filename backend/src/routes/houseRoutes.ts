import { Router } from 'express';
import { deleteHouse, upsertHouse } from '~/controllers/houseController';

const router = Router();

router.post('/upsert', upsertHouse);
router.post('/delete', deleteHouse);

export default router
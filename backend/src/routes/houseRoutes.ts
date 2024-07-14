import { Router } from 'express';
import { getHouses, upsertHouse } from '~/controllers/houseController';

const router = Router();

router.get('/', getHouses);
router.post('/upsert', upsertHouse);

export default router
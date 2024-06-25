import { Router } from 'express';
import { getHouses, saveHouse } from '../controllers/houseController';

const router = Router();

router.get('/', getHouses);
router.post('/upsert', saveHouse);

export default router
import { Router } from 'express';
import { findHouses, saveHouse } from '../controllers/houseController';

const router = Router();

router.get('/', findHouses);
router.post('/save', saveHouse);

export default router
import { Router } from 'express';
import { findHouses, saveHouse } from '../controllers/houseController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', findHouses);
router.post('/save', verifyToken, saveHouse);

export default router
import { Router } from 'express';
import { getHouses, saveHouse } from '../controllers/houseController';
import verifyToken from '../middleware/authMiddleware';

const router = Router();

router.get('/', getHouses);
router.post('/save', verifyToken, saveHouse);

export default router
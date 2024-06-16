import { Router } from 'express';
import { findHouses } from '../controllers/houseController';

const router = Router();

router.get('/', findHouses);

export default router
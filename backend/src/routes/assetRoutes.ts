import express from 'express';
import { uploadAsset } from '~/controllers/assetController';
import { handleFormData } from '~/middleware/assetMiddleware';

const router = express.Router();


router.post('/upload', handleFormData, uploadAsset);

export default router;
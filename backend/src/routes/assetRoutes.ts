import express from 'express';
import multer from 'multer';
import { ExpressMiddleware } from '~/@types';
import { uploadImage } from '~/controllers/assetController';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), uploadImage);

export default router;
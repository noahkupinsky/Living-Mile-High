import express from 'express';
import multer from 'multer';
import { uploadImage } from '~/controllers/imageController';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), uploadImage);

export default router;
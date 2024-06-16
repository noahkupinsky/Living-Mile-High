import express from 'express';
import multer from 'multer';
import { getService } from '../app';

const router = express.Router();
const upload = multer(); // Assuming you are using multer for file uploads

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = await getService('image').uploadImage(req.file);
        res.json({ imageUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/garbage-collect', async (req, res) => {
    try {
        await getService('image').garbageCollect();
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
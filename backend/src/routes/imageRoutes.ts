import express from 'express';
import multer from 'multer';
import { services } from '~/di';

const router = express.Router();
const upload = multer();
const imageService = () => services().imageService;

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = await imageService().uploadImage(req.file);
        res.json({ imageUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
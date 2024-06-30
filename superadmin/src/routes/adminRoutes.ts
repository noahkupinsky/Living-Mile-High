import { Router } from 'express';
import mongoose, { model } from 'mongoose';
import { AdminSchema, hashPassword } from 'living-mile-high-lib';

const AdminModel = model('Admin', AdminSchema);

const router = Router();

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI!);

router.post('/create', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);
        await AdminModel.create({ username, password: hashedPassword });

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.post('/update', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const result = await AdminModel.updateOne({ username }, { password: hashedPassword });

        if (!result.matchedCount) {
            res.status(404).json({ success: false, error: 'Admin not found.' });
            return;
        }

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.delete('/delete', async (req, res) => {
    const { username } = req.body;
    try {
        const result = await AdminModel.deleteOne({ username });

        if (!result.deletedCount) {
            res.status(404).json({ success: false, error: 'Admin not found.' });
            return;
        }

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

export default router
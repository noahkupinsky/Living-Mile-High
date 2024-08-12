import multer from "multer";
import { ExpressMiddleware } from "~/@types";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const handleFormData: ExpressMiddleware = async (req, res, next) => {
    upload.single('file')(req, res, next);
};
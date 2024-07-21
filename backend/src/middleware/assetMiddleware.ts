import multer from "multer";
import { ExpressMiddleware } from "~/@types";

const upload = multer();

export const handleFormData: ExpressMiddleware = async (req, res, next) => {
    upload.single('file')(req, res, next);
}
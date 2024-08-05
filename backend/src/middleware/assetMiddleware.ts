import multer from "multer";
import { ExpressMiddleware } from "~/@types";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.memoryStorage(); // Use memory storage to handle file buffer
const upload = multer({ storage });

export const handleFormData: ExpressMiddleware = async (req, res, next) => {
    upload.single('file')(req, res, next);
};
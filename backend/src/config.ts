import dotenv from 'dotenv';

dotenv.config();

export const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH!;
export const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const PORT = process.env.PORT || 5000;
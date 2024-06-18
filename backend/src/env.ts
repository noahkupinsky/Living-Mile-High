import dotenv from 'dotenv';
import path from 'path';

const envFile = path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envFile });

export const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const BACKEND_PORT = process.env.BACKEND_PORT!;
export const DO_SPACE_KEY = process.env.DO_SPACE_KEY!;
export const DO_SPACE_SECRET = process.env.DO_SPACE_SECRET!;
export const DO_SPACE_REGION = process.env.DO_SPACE_REGION!;
export const DO_SPACE_URL = process.env.DO_SPACE_URL!;
export const DO_SPACE_BUCKET = process.env.DO_SPACE_BUCKET!;
export const HOST = process.env.HOST!;
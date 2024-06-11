import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';

const rootEnvPath = path.resolve(__dirname, '../../.env');
const serviceEnvPath = path.resolve(__dirname, '../.env');

const myEnv = dotenv.config({ path: rootEnvPath });
dotenvExpand.expand(myEnv);

dotenv.config({ path: serviceEnvPath });

export const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH!;
export const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
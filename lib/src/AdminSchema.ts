import { Schema, Document } from 'mongoose';
import { AdminRecord } from './types';

export interface AdminDocument extends Document, AdminRecord { }

export const AdminSchema = new Schema<AdminDocument>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

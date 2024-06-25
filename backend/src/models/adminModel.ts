import { Schema, model, Document } from 'mongoose';
import { AdminRecord } from '../types';

interface AdminDocument extends Document, AdminRecord { }

const AdminSchema = new Schema<AdminDocument>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const AdminModel = model<AdminDocument>('Admin', AdminSchema);

export default AdminModel;

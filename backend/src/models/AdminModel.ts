import { Schema, model, Document } from 'mongoose';
import { AdminRecord } from 'types/Admin';

interface AdminDocument extends Document, AdminRecord { }

const AdminSchema = new Schema<AdminDocument>({
    email: { type: String, required: true, unique: true },
});

const Admin = model<AdminDocument>('Admin', AdminSchema);

export default Admin;
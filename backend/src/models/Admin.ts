import { Schema, model, Document } from 'mongoose';

interface IAdmin extends Document {
    email: string;
}

const AdminSchema = new Schema<IAdmin>({
    email: { type: String, required: true, unique: true },
});

const Admin = model<IAdmin>('Admin', AdminSchema);

export default Admin;
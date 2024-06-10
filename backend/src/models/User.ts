import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    role: string;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
});

const User = model<IUser>('User', UserSchema);

export default User;
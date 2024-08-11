import { AdminSchema, hashPassword } from "living-mile-high-lib";
import mongoose, { model } from "mongoose";
import { loadEnvFile } from "./envUtils";
import { joinEnv } from "../config";

export const AdminModel = model('Admin', AdminSchema);

export async function withMongo(uri: string, fn: () => Promise<void>) {
    await mongoose.connect(uri);
    try {
        await fn();
    } finally {
        await mongoose.disconnect();
    }
}

export async function upsertAdmin(username: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const newAdmin = new AdminModel({ username, password: hashedPassword });
    await newAdmin.save();
    console.log('Admin upserted into MongoDB.');
}

export async function deleteAdmin(username: string) {
    const result = await AdminModel.deleteOne({ username });
    if (!result.deletedCount || result.deletedCount === 0) {
        throw new Error('Admin not found.');
    }
    console.log('Admin deleted from MongoDB.');
}



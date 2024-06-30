import { AdminDocument, AdminSchema } from "living-mile-high-lib";
import { model } from "mongoose";

export const AdminModel = model<AdminDocument>('Admin', AdminSchema);
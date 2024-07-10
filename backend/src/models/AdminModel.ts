import { model } from "mongoose";
import { AdminDocument, AdminSchema } from "living-mile-high-lib";

export const AdminModel = model<AdminDocument>('Admin', AdminSchema);
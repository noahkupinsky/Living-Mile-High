import { ContactLogRecord } from "~/@types/database";
import { Schema, model, Document } from 'mongoose';
import { CONTACT_LOG_EXPIRES_IN_SECONDS } from "~/@types/constants";

export interface ContactLogDocument extends Document, ContactLogRecord { }

const ContactLogSchema = new Schema<ContactLogDocument>({
    ip: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: CONTACT_LOG_EXPIRES_IN_SECONDS },
});

const ContactLogModel = model<ContactLogDocument>('ContactLog', ContactLogSchema);

export default ContactLogModel
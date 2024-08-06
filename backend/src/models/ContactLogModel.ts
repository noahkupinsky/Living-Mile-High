import { ContactLogRecord } from "~/@types/database";
import { Schema, model, Document } from 'mongoose';

const EXPIRES_IN_SECONDS = 60 * 60 * 24; // one day :)

export interface ContactLogDocument extends Document, ContactLogRecord { }

const ContactLogSchema = new Schema<ContactLogDocument>({
    ip: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: EXPIRES_IN_SECONDS },
});

const ContactLogModel = model<ContactLogDocument>('ContactLog', ContactLogSchema);

export default ContactLogModel
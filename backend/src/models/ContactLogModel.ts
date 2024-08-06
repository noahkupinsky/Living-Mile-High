import { ContactLogRecord } from "~/@types/database";
import { Schema, model, Document } from 'mongoose';

const SECONDS_IN_DAY = 60 * 60 * 24;

export interface ContactLogDocument extends Document, ContactLogRecord { }

const ContactLogSchema = new Schema<ContactLogDocument>({
    ip: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: SECONDS_IN_DAY },
});

const ContactLogModel = model<ContactLogDocument>('ContactLog', ContactLogSchema);

export default ContactLogModel
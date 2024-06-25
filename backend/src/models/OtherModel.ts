import { Schema, model, Document } from 'mongoose';
import { OtherData, OtherRecord } from '../types';
import { optionals } from 'src/types/enums';
import { DeepPartial } from 'living-mile-high-lib';

export interface OtherDocument extends Document, OtherRecord { }

const OtherSchema = new Schema<OtherDocument>({
    about: {
        text: { type: String, required: true },
        image: { type: String, required: true },
    },
    contact: {
        text: { type: String, required: true },
        image: { type: String, required: true },
    },
    placeholderImages: { type: [String] },
    homeImages: { type: [String], required: true },
});

const OtherModel = model<OtherDocument>('House', OtherSchema);

export function otherDocumentToObject(doc: OtherDocument): OtherData {
    const data: OtherData = {
        about: doc.get('about'),
        contact: doc.get('contact'),
        homeImages: doc.get('homeImages'),
        placeholderImages: doc.get('placeholderImages'),
    }
    return data;
}

export function otherPartialToUpsert(other: DeepPartial<OtherData>): DeepPartial<OtherDocument> {
    const o = optionals(other);
    const otherUpsert: Partial<OtherDocument> = {
        ...o('about'),
        ...o('contact'),
        ...o('homeImages'),
        ...o('placeholderImages'),
    }
    return otherUpsert;
}

export default OtherModel;
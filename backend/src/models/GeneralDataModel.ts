import { Schema, model, Document } from 'mongoose';
import { GeneralData } from 'living-mile-high-lib';
import { GeneralDataRecord } from '~/@types';

export interface GeneralDataDocument extends Document, GeneralDataRecord { }

const GeneralDataSchema = new Schema<GeneralDataDocument>({
    about: {
        text: { type: String, required: true },
        image: { type: String, required: true },
    },
    contact: {
        text: { type: String, required: true },
        image: { type: String, required: true },
    },
    defaultImages: { type: [String] },
    homeImages: { type: [String], required: true },
});

const GeneralDataModel = model<GeneralDataDocument>('GeneralData', GeneralDataSchema);

export function generalDocumentToObject(doc: GeneralDataDocument): GeneralData {
    const { about, contact, homeImages, defaultImages } = doc;

    const data: GeneralData = {
        about,
        contact,
        homeImages,
        defaultImages
    }

    return data;
}

export function generalObjectToNewDocument(data: GeneralData): GeneralDataRecord {
    const { about, contact, homeImages, defaultImages } = data;

    const doc = {
        about,
        contact,
        homeImages,
        defaultImages
    }

    return doc;
}

export default GeneralDataModel;
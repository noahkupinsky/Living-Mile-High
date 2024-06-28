import { Schema, model, Document } from 'mongoose';
import { GeneralDataRecord } from '../types';
import { optionals } from '../types/enums';
import { DeepPartial, GeneralData } from 'living-mile-high-lib';

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
    const data: GeneralData = {
        about: doc.get('about'),
        contact: doc.get('contact'),
        homeImages: doc.get('homeImages'),
        defaultImages: doc.get('defaultImages'),
    }
    return data;
}
// TODO: Create GeneralDataUpsert type to pass in, and return the same type. Update names appropriately

export function generalPartialToUpsert(generalData: DeepPartial<GeneralData>): DeepPartial<GeneralDataDocument> {
    const o = optionals(generalData);
    const generalUpsert: Partial<GeneralDataDocument> = {
        ...o('about'),
        ...o('contact'),
        ...o('homeImages'),
        ...o('defaultImages'),
    }
    return generalUpsert;
}

export default GeneralDataModel;
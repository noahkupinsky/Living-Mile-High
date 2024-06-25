import { Schema, model, Document } from 'mongoose';
import { HouseRecord } from '../types';
import { DeepPartial, House } from 'living-mile-high-lib';
import { optionals } from '../types/enums';

export interface HouseDocument extends Document, HouseRecord { }

const HouseSchema = new Schema<HouseDocument>({
    address: { type: String, required: true },
    isDeveloped: { type: Boolean, required: true },
    isForSale: { type: Boolean, required: true },
    isSelectedWork: { type: Boolean, required: true },
    mainImage: { type: String, required: true },
    images: { type: [String] },
    neighborhood: { type: String, required: true },
    stats: {
        houseSquareFeet: { type: Number },
        lotSquareFeet: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        garageSpaces: { type: Number },
    }
}, {
    timestamps: true
});

const HouseModel = model<HouseDocument>('House', HouseSchema);

export function houseDocumentToObject(doc: HouseDocument): House {
    const house: House = {
        id: doc.get('id'),
        isDeveloped: doc.get('isDeveloped'),
        isForSale: doc.get('isForSale'),
        isSelectedWork: doc.get('isSelectedWork'),
        address: doc.get('address'),
        mainImage: doc.get('mainImage'),
        images: doc.get('images'),
        neighborhood: doc.get('neighborhood'),
        stats: doc.get('stats'),
        createdAt: doc.get('createdAt'),
        updatedAt: doc.get('updatedAt'),
    };
    return house;
}

export function housePartialToUpsert(house: DeepPartial<House>): DeepPartial<HouseDocument> {
    const o = optionals(house);
    const houseUpsert: Partial<HouseDocument> = {
        ...o('isDeveloped'),
        ...o('isForSale'),
        ...o('isSelectedWork'),
        ...o('address'),
        ...o('mainImage'),
        ...o('images'),
        ...o('neighborhood'),
        ...o('stats'),
    }
    return houseUpsert;
}

export default HouseModel;

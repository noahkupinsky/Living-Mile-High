import { Schema, model, Document } from 'mongoose';
import { HouseRecord } from '../types';

export interface HouseDocument extends Document, HouseRecord { }

const HouseSchema = new Schema<HouseDocument>({
    address: { type: String, required: true },
    isDeveloped: { type: Boolean, required: true },
    isForSale: { type: Boolean, required: true },
    isSelectedWork: { type: Boolean, required: true },
    mainImage: { type: String, required: true },
    images: { type: [String], required: true },
    neighborhood: { type: String, required: true },
    stats: {
        houseSquareFeet: { type: Number },
        lotSquareFeet: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        garageSpaces: { type: Number },
    }
});

const HouseModel = model<HouseDocument>('House', HouseSchema);

export default HouseModel;

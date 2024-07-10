import { Schema, model, Document } from 'mongoose';
import { HouseRecord } from '../types';
import { House } from 'living-mile-high-lib';

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
    const { id, isDeveloped, isForSale, isSelectedWork, address, mainImage, images, neighborhood, stats, createdAt, updatedAt } = doc;

    const house: House = {
        id,
        isDeveloped,
        isForSale,
        isSelectedWork,
        address,
        mainImage,
        images,
        neighborhood,
        stats,
        createdAt,
        updatedAt,
    };

    return house;
}

type NewHouseDocument = Omit<HouseRecord, 'id' | 'createdAt' | 'updatedAt'>;

export function houseObjectToNewDocument(house: House): NewHouseDocument {
    const { isDeveloped, isForSale, isSelectedWork, address, mainImage, images, neighborhood, stats } = house;

    const doc = {
        isDeveloped,
        isForSale,
        isSelectedWork,
        address,
        mainImage,
        images,
        neighborhood,
        stats,
    };

    return doc
}

export default HouseModel;

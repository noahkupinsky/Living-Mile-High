import { Schema, model, Document } from 'mongoose';
import { House } from 'living-mile-high-lib';
import { HouseRecord } from '~/@types';

export interface HouseDocument extends Document, HouseRecord { }

const HouseSchema = new Schema<HouseDocument>({
    address: { type: String, required: true },
    isDeveloped: { type: Boolean, required: true },
    isForSale: { type: Boolean, required: true },
    isSelectedWork: { type: Boolean, required: true },
    mainImage: { type: String, required: true },
    images: { type: [String] },
    neighborhood: { type: String, required: false },
    priority: { type: Number, required: false },
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
    const {
        id, createdAt, updatedAt,
        isDeveloped, isForSale, isSelectedWork,
        address, neighborhood,
        mainImage, images,
        priority,
        stats,
    } = doc;
    const createdAtString = createdAt?.toISOString();
    const updatedAtString = updatedAt?.toISOString();

    const house: House = {
        id, createdAt: createdAtString, updatedAt: updatedAtString,
        isDeveloped, isForSale, isSelectedWork,
        address, neighborhood,
        mainImage, images,
        priority,
        stats,
    };

    return house;
}

// the Object -> Document direction omits id, createdAt, and updatedAt 
// because it is assumed that these fields are handled by the database
type HouseDocumentUpsert = Omit<HouseRecord, 'id' | 'createdAt' | 'updatedAt'>;

export function houseObjectToDocument(house: House): HouseDocumentUpsert {
    const {
        isDeveloped, isForSale, isSelectedWork,
        address, neighborhood,
        mainImage, images,
        priority,
        stats
    } = house;

    const doc = {
        isDeveloped, isForSale, isSelectedWork,
        address, neighborhood,
        mainImage, images,
        priority,
        stats: stats || {},
    };

    return doc
}

export default HouseModel;

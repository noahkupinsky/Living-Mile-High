import { House } from "living-mile-high-types";

export interface HouseRecord {
    address: { type: String, required: true },
    onHomePage: { type: Boolean, required: true },
    isDeveloped: { type: Boolean, required: true },
    isForSale: { type: Boolean, required: true },
    mainPhoto: { type: String, required: true },
    photos: { type: [String], required: true },
    neighborhood: { type: String, required: true },
    stats: {
        houseSquareFeet: { type: Number },
        lotSquareFeet: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        garageSpaces: { type: Number },
    }
}

export interface HouseService {
    async findHouses(houseFilter: HouseFilter): Promise<any>;
    async saveHouse(house: House): Promise<void>;
}


import { House } from "living-mile-high-types";

export interface HouseRecord {
    address: string;
    onHomePage: boolean;
    isDeveloped: boolean;
    isForSale: boolean;
    isSelectedWork: boolean;
    mainImage: string;
    images: string[];
    neighborhood: string;
    stats: {
        houseSquareFeet?: number;
        lotSquareFeet?: number;
        bedrooms?: number;
        bathrooms?: number;
        garageSpaces?: number;
    };
}

export interface HouseService {
    async findHouses(houseFilter: HouseFilter): Promise<any>;
    async saveHouse(house: House): Promise<void>;
    async allImages(): Promise<string[]>;
    async allNeighborhoods(): Promise<string[]>;
}


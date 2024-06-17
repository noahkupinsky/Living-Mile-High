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
    findHouses(houseFilter: HouseFilter): Promise<any>;
    saveHouse(house: House): Promise<void>;
    allImages(): Promise<string[]>;
    allNeighborhoods(): Promise<string[]>;
}


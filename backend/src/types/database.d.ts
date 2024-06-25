import { House } from "living-mile-high-types";


export interface AdminRecord {
    username: string;
    password: string;
}

export interface HouseRecord {
    address: string;
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


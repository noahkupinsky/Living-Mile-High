export type AdminRecord = {
    username: string;
    password: string;
}

export type HouseRecord = {
    address: string;
    isDeveloped: boolean;
    isForSale: boolean;
    isSelectedWork: boolean;
    mainImage: string;
    images: string[];
    neighborhood?: string;
    priority?: number;
    stats: {
        houseSquareFeet?: number;
        lotSquareFeet?: number;
        bedrooms?: number;
        bathrooms?: number;
        garageSpaces?: number;
        garageSquareFeet?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export type GeneralDataRecord = {
    about: {
        text: string;
        image: string;
    },
    contact: {
        text: string;
        image: string
    },
    defaultImages: string[],
    homePageImages: string[]
}

export type ContactLogRecord = {
    ip: string;
    email: string;
    createdAt: Date;
}


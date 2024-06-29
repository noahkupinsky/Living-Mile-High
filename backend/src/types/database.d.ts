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
    neighborhood: string;
    stats: {
        houseSquareFeet?: number;
        lotSquareFeet?: number;
        bedrooms?: number;
        bathrooms?: number;
        garageSpaces?: number;
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
    homeImages: string[]
}


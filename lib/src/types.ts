import { BackupType } from "./defaults"

export type House = {
    id?: string,
    isDeveloped: boolean,
    isForSale: boolean,
    isSelectedWork: boolean,
    address: string,
    mainImage: string,
    images: string[],
    neighborhood?: string,
    stats: HouseStats,
    createdAt?: string,
    updatedAt?: string,
}

export type HouseStats = {
    houseSquareFeet?: number,
    lotSquareFeet?: number,
    bedrooms?: number,
    bathrooms?: number,
    garageSpaces?: number,
}

export type HouseBoolean = 'isDeveloped' | 'isForSale' | 'isSelectedWork'

export type AboutData = {
    text: string,
    image: string,
}

export type ContactData = {
    text: string,
    image: string
}

export type GeneralData = {
    about: AboutData,
    contact: ContactData,
    defaultImages: string[],
    homePageImages: string[]
}

export type SiteData = GeneralData & { houses: House[] }

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AdminRecord = {
    username: string,
    password: string
}

export type BackupIndex = {
    key: string,
    name: string,
    createdAt: string
    backupType: BackupType
}

export type ContactForm = {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}
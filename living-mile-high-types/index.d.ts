export type House = {
    id?: string,
    isDeveloped: boolean,
    isForSale: boolean,
    isSelectedWork: boolean,
    address: string,
    mainImage: string,
    images: string[],
    neighborhood: string,
    stats: HouseStats
}

export type HouseStats = {
    houseSquareFeet?: number,
    lotSquareFeet?: number,
    bedrooms?: number,
    bathrooms?: number,
    garageSpaces?: number,
}


export type HouseQuery = {
    isDeveloped?: boolean,
    isForSale?: boolean,
    isSelectedWork?: boolean,
    address?: string,
    neighborhood?: string,
    mainImage?: string
}

export type AboutData = {
    text: string,
    image: string
}

export type ContactData = {
    text: string,
    image: string
}

export type AppData = {
    about: AboutData,
    contact: ContactData,
    houses: House[],
    placeholderImages: string[],
    homeImages: string[]
}

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

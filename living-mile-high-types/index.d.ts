export type House = {
    id?: string,
    onHomePage: boolean,
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
    onHomePage?: string,
    isDeveloped?: string,
    isForSale?: string,
    isSelectedWork?: string,
    address?: string,
    neighborhood?: string,
    mainImage?: string
}
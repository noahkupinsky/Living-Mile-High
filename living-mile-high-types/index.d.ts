export type House = {
    id?: string,
    onHomePage: boolean,
    isDeveloped: boolean,
    isForSale: boolean,
    address: string,
    mainPhoto: string,
    photos: string[],
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
    address?: string,
    neighborhood?: string,
    mainPhoto?: string
}
export type House = {
    onHomePage: boolean,
    isDeveloped: boolean,
    isForSale: boolean,
    address: string,
    mainPhotoUrl: string,
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
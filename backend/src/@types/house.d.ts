
export interface HouseRecord {
    address: string;
}

export interface HouseService {
    async getHouseByAddress(address: string): Promise<any>;
}


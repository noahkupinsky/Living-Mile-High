import { HouseService } from "src/@types";

export class MongoHouseService implements HouseService {
    async getHouseByAddress(address: string): Promise<any> {
        return null;
    }
}
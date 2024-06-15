import { HouseService } from 'src/@types/house';

export class MongoHouseService implements HouseService {
    async getHouseByAddress(address: string): Promise<any> {
        return null;
    }
}
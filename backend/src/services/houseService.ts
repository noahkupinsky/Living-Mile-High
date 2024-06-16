import { House, HouseQuery } from 'living-mile-high-types';
import { HouseService } from '../@types/house';
import HouseModel, { HouseDocument } from '../models/houseModel';

export class MongoHouseService implements HouseService {
    async findHouses(houseFilter: HouseQuery): Promise<House[]> {
        try {
            const { address, onHomePage, isDeveloped, isForSale, neighborhood, mainPhoto } = houseFilter;
            const filter: any = {};

            if (address) {
                filter.address = new RegExp(address, 'i'); // Case-insensitive search
            }
            if (onHomePage !== undefined) {
                filter.onHomePage = (onHomePage === 'true');
            }
            if (isDeveloped !== undefined) {
                filter.isDeveloped = (isDeveloped === 'true');
            }
            if (isForSale !== undefined) {
                filter.isForSale = (isForSale === 'true');
            }
            if (neighborhood) {
                filter.neighborhood = new RegExp(neighborhood, 'i'); // Case-insensitive search
            }
            if (mainPhoto) {
                filter.mainPhoto = mainPhoto;
            }

            const houses = await HouseModel.find(filter);
            return houses.map(doc => this.houseRecordToObject(doc));
        } catch (error) {
            console.log("Invalid Filter or db error", error);
            return [];
        }
    };

    private houseRecordToObject(doc: HouseDocument): House {
        const house: House = {
            onHomePage: doc.get('onHomePage'),
            isDeveloped: doc.get('isDeveloped'),
            isForSale: doc.get('isForSale'),
            address: doc.get('address'),
            mainPhoto: doc.get('mainPhoto'),
            photos: doc.get('photos'),
            neighborhood: doc.get('neighborhood'),
            stats: {
                houseSquareFeet: doc.get('stats.houseSquareFeet'),
                lotSquareFeet: doc.get('stats.lotSquareFeet'),
                bedrooms: doc.get('stats.bedrooms'),
                bathrooms: doc.get('stats.bathrooms'),
                garageSpaces: doc.get('stats.garageSpaces'),
            }
        };
        return house;
    }
}
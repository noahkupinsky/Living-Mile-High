import { House } from 'living-mile-high-types';
import { HouseService } from '../../types/database';
import HouseModel, { HouseDocument } from '../../models/houseModel';

class MongoHouseService implements HouseService {
    async getHouses(): Promise<House[]> {
        const houses: HouseDocument[] = await HouseModel.find();
        return houses.map(house => this.houseRecordToObject(house));
    };

    async saveHouse(house: House): Promise<void> {
        let savedHouse;
        if (house.id) {
            // Extract the id and remove it from the update object
            const { id, ...updateData } = house;
            // Update existing house
            savedHouse = await HouseModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!savedHouse) {
                throw new Error('House not found');
            }
        } else {
            // Create new house
            savedHouse = new HouseModel(house);
            await savedHouse.save();
        }
    }

    async allImages(): Promise<string[]> {
        const houses = await HouseModel.find();
        return houses.flatMap((house: any) => [house.mainImage, ...house.images]);
    }

    async allNeighborhoods(): Promise<string[]> {
        const houses = await HouseModel.find();
        return houses.map((house: any) => house.neighborhood);
    }

    private houseRecordToObject(doc: HouseDocument): House {
        const house: House = {
            id: doc.get('id'),
            isDeveloped: doc.get('isDeveloped'),
            isForSale: doc.get('isForSale'),
            isSelectedWork: doc.get('isSelectedWork'),
            address: doc.get('address'),
            mainImage: doc.get('mainImage'),
            images: doc.get('images'),
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

export default MongoHouseService
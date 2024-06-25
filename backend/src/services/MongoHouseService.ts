import { DeepPartial, House } from 'living-mile-high-lib';
import { HouseService } from '../types';
import HouseModel, { HouseDocument, houseDocumentToObject, housePartialToUpsert } from '../models/HouseModel';

class MongoHouseService implements HouseService {
    async getHouseObjects(): Promise<House[]> {
        const houses: HouseDocument[] = await HouseModel.find();
        return houses.map(house => houseDocumentToObject(house));
    };

    async upsertHouse(house: DeepPartial<House>): Promise<void> {
        const upsert: DeepPartial<HouseDocument> = housePartialToUpsert(house);
        const id = house.id;
        let savedHouse;

        if (id) {
            const id = house.id;

            savedHouse = await HouseModel.findByIdAndUpdate(id, upsert, { new: true });
            if (!savedHouse) {
                throw new Error('House not found');
            }
        } else {
            savedHouse = new HouseModel(upsert);
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
}

export default MongoHouseService
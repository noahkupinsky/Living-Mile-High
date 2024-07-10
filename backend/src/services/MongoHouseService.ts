import { DeepPartial, House } from 'living-mile-high-lib';
import { HouseService } from '~/@types';
import HouseModel, { HouseDocument, houseDocumentToObject, houseObjectToNewDocument } from '~/models/HouseModel';
import { constructUpdateObject } from '~/utils/constructUpdateObject';

export class MongoHouseService implements HouseService {
    async getHouseObjects(): Promise<House[]> {
        const houses: HouseDocument[] = await HouseModel.find();
        return houses.map(house => houseDocumentToObject(house));
    };

    async upsertHouse(house: DeepPartial<House>): Promise<void> {
        const id = house.id;

        if (id) {
            await this.updateHouse(id, house);
        } else {
            await this.insertHouse(house as House);
        }
    }

    private async updateHouse(id: any, house: DeepPartial<House>): Promise<void> {
        const updateFields = constructUpdateObject(house);

        const foundHouse = await HouseModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

        if (!foundHouse) {
            throw new Error('House not found');
        }
    }

    private async insertHouse(house: House): Promise<void> {
        const doc = houseObjectToNewDocument(house);
        const savedHouse = new HouseModel(doc);
        await savedHouse.save();
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
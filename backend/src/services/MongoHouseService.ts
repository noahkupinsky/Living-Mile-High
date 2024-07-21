import { DeepPartial, House } from 'living-mile-high-lib';
import { HouseService } from '~/@types';
import HouseModel, { HouseDocument, houseDocumentToObject, houseObjectToNewDocument } from '~/models/HouseModel';
import withLock from '~/utils/locks';
import { constructUpdateObject } from '~/utils/misc';

export class MongoHouseService implements HouseService {
    async getHouseObjects(): Promise<House[]> {
        const houses: HouseDocument[] = await HouseModel.find();
        return houses.map(house => houseDocumentToObject(house));
    };

    async upsertHouse(house: DeepPartial<House>): Promise<string> {
        const id = house.id;

        if (id) {
            return await this.updateHouse(id, house);
        } else {
            return await this.insertHouse(house as House);
        }
    }

    private async updateHouse(id: any, house: DeepPartial<House>): Promise<string> {
        await withLock(id, async () => {
            const updateFields = constructUpdateObject(house);

            const foundHouse = await HouseModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

            if (!foundHouse) {
                throw new Error('House not found');
            }
        });

        return id;
    }


    async deleteHouse(id: string): Promise<boolean> {
        const deletedHouse = await HouseModel.findByIdAndDelete({ _id: id });

        return !!deletedHouse;
    }

    private async insertHouse(house: House): Promise<string> {
        const doc = houseObjectToNewDocument(house);
        const houseModel = new HouseModel(doc);
        const savedHouse = await houseModel.save();
        return savedHouse.id;
    }
}
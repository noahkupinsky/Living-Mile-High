import { House, HouseQuery } from 'living-mile-high-types';
import { HouseService } from '../@types/house';
import HouseModel, { HouseDocument } from '../models/houseModel';

export class MongoHouseService implements HouseService {
    async findHouses(houseQuery: HouseQuery): Promise<House[]> {
        try {
            const { address, onHomePage, isDeveloped, isSelectedWork, isForSale, neighborhood, mainImage } = houseQuery;
            const dbQuery: any = {};

            if (address) {
                dbQuery.address = new RegExp(address, 'i'); // Case-insensitive search
            }
            if (onHomePage !== undefined) {
                dbQuery.onHomePage = (onHomePage === 'true');
            }
            if (isDeveloped !== undefined) {
                dbQuery.isDeveloped = (isDeveloped === 'true');
            }
            if (isForSale !== undefined) {
                dbQuery.isForSale = (isForSale === 'true');
            }
            if (isSelectedWork !== undefined) {
                dbQuery.isSelectedWork = (isSelectedWork === 'true');
            }
            if (neighborhood) {
                dbQuery.neighborhood = new RegExp(neighborhood, 'i'); // Case-insensitive search
            }
            if (mainImage) {
                dbQuery.mainImage = mainImage;
            }

            const houses = await HouseModel.find(dbQuery);
            return houses.map(doc => this.houseRecordToObject(doc));
        } catch (error) {
            console.log("Invalid Filter or db error", error);
            return [];
        }
    };

    async saveHouse(house: House): Promise<void> {
        if (!house.address || !house.mainImage || !house.neighborhood) {
            throw new Error('House address, main image, and neighborhood are required.');
        }

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
            onHomePage: doc.get('onHomePage'),
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
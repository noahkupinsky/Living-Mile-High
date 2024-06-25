import { HouseService } from "../src/types";
import HouseModel from "../src/models/houseModel";
import { services } from "../src/app";
import { House } from "living-mile-high-types";

let houseService: HouseService;

beforeAll(() => {
    houseService = services().houseService;
})

describe('HouseService get and save', () => {
    it('should fetch all houses', async () => {
        const mockHouseData = {
            isDeveloped: true,
            isForSale: true,
            isSelectedWork: false,
            address: '123 Main St',
            mainImage: 'image.jpg',
            images: ['image1.jpg', 'image2.jpg'],
            neighborhood: 'Downtown',
            stats: {
                houseSquareFeet: 2000,
                lotSquareFeet: 3000,
                bedrooms: 3,
                bathrooms: 2,
                garageSpaces: 2
            }
        };
        const house = new HouseModel(mockHouseData);
        await house.save();

        const houses = await houseService.getHouses();
        expect(houses.length).toBe(1);
        expect(houses[0].address).toBe(mockHouseData.address);
    });

    it('should save a house', async () => {
        const mockHouse: House = {
            isDeveloped: true,
            isForSale: true,
            isSelectedWork: false,
            address: '123 Main St',
            mainImage: 'image.jpg',
            images: ['image1.jpg', 'image2.jpg'],
            neighborhood: 'Downtown',
            stats: {
                houseSquareFeet: 2000,
                lotSquareFeet: 3000,
                bedrooms: 3,
                bathrooms: 2,
                garageSpaces: 2
            }
        };

        await houseService.saveHouse(mockHouse);
        const savedHouse = await HouseModel.findOne({ address: mockHouse.address });
        expect(savedHouse).not.toBeNull();
        expect(savedHouse!.address).toBe(mockHouse.address);
    });

    it('should update a house', async () => {
        const mockHouse: House = {
            isDeveloped: true,
            isForSale: true,
            isSelectedWork: false,
            address: '123 Main St',
            mainImage: 'image.jpg',
            images: ['image1.jpg', 'image2.jpg'],
            neighborhood: 'Downtown',
            stats: {
                houseSquareFeet: 2000,
                lotSquareFeet: 3000,
                bedrooms: 3,
                bathrooms: 2,
                garageSpaces: 2
            }
        };
        await houseService.saveHouse(mockHouse);
        const savedHouse = await HouseModel.findOne({ address: mockHouse.address });
        expect(savedHouse).not.toBeNull();
        const savedHouseId = savedHouse!._id as string;

        const updatedHouse: House = {
            ...mockHouse,
            id: savedHouseId,
            isForSale: false
        };

        await houseService.saveHouse(updatedHouse);
        const updatedSavedHouse = await HouseModel.findById(savedHouseId);
        expect(updatedSavedHouse!.isForSale).toBe(false);
    })
});

describe('Other HouseService Methods', () => {
    beforeEach(async () => {
        await HouseModel.create([
            {
                address: '123 Main St',
                isDeveloped: true,
                isForSale: true,
                isSelectedWork: false,
                mainImage: 'photo1.jpg',
                images: ['photo2.jpg', 'photo3.jpg'],
                neighborhood: 'Downtown',
                stats: {
                    houseSquareFeet: 2000,
                    lotSquareFeet: 5000,
                    bedrooms: 3,
                    bathrooms: 2,
                    garageSpaces: 2,
                }
            },
            {
                address: '456 Elm St',
                isDeveloped: false,
                isForSale: false,
                isSelectedWork: false,
                mainImage: 'photo4.jpg',
                images: ['photo5.jpg', 'photo6.jpg'],
                neighborhood: 'Suburbia',
                stats: {
                    houseSquareFeet: 1500,
                    lotSquareFeet: 3000,
                    bedrooms: 2,
                    bathrooms: 1,
                    garageSpaces: 1,
                }
            }
        ]);
    });


    describe('allNeighborhoods', () => {
        it('should return all unique neighborhoods', async () => {
            const neighborhoods = await houseService.allNeighborhoods();
            expect(neighborhoods).toEqual(expect.arrayContaining(['Downtown', 'Suburbia']));
            expect(neighborhoods).toHaveLength(2);
        });
    });

    describe('allPhotos', () => {
        it('should return all photos including mainPhoto and additional photos', async () => {
            const photos = await houseService.allImages();
            expect(photos).toEqual(expect.arrayContaining(['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg']));
            expect(photos).toHaveLength(6);
        });
    });
});



import { HouseService } from "../src/@types";
import { getService } from "../src/app";
import HouseModel from "../src/models/houseModel";

let houseService: HouseService;

beforeAll(() => {
    houseService = getService('house');
})

beforeEach(async () => {
    await HouseModel.create([
        {
            address: '123 Main St',
            onHomePage: true,
            isDeveloped: true,
            isForSale: true,
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
            onHomePage: false,
            isDeveloped: false,
            isForSale: false,
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

import HouseModel from '../src/models/houseModel';
import { getRequest } from './setup';

let request: any;

describe('findHouses Function', () => {
    beforeAll(() => {
        request = getRequest();
    });

    beforeEach(async () => {
        await HouseModel.create([
            {
                address: '123 Main St',
                onHomePage: true,
                isDeveloped: true,
                isForSale: true,
                mainPhoto: 'photo1.jpg',
                photos: ['photo1.jpg', 'photo2.jpg'],
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
                mainPhoto: 'photo2.jpg',
                photos: ['photo3.jpg', 'photo4.jpg'],
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

    it('should filter houses by address', async () => {
        const response = await request.get('/api/houses').query({ address: 'Main' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].address).toBe('123 Main St');
    });

    it('should filter houses by onHomePage', async () => {
        const response = await request
            .get('/api/houses')
            .query({ onHomePage: 'true' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].onHomePage).toBe(true);
    });

    it('should filter houses by isDeveloped', async () => {
        const response = await request
            .get('/api/houses')
            .query({ isDeveloped: 'false' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].isDeveloped).toBe(false);
    });

    it('should filter houses by isForSale', async () => {
        const response = await request
            .get('/api/houses')
            .query({ isForSale: 'true' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].isForSale).toBe(true);
    });

    it('should filter houses by neighborhood', async () => {
        const response = await request
            .get('/api/houses')
            .query({ neighborhood: 'Downtown' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].neighborhood).toBe('Downtown');
    });

    it('should filter houses by mainPhoto', async () => {
        const response = await request
            .get('/api/houses')
            .query({ mainPhoto: 'photo2.jpg' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].mainPhoto).toBe('photo2.jpg');
    });
});
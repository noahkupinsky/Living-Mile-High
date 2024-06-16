import HouseModel, { HouseDocument } from '../src/models/houseModel';
import { getRequest } from './setup';

let request: any;

beforeAll(() => {
    request = getRequest();
});

describe('House queries', () => {

    beforeEach(async () => {
        await HouseModel.create([
            {
                address: '123 Main St',
                onHomePage: true,
                isDeveloped: true,
                isForSale: true,
                mainImage: 'photo1.jpg',
                images: ['photo1.jpg', 'photo2.jpg'],
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
                mainImage: 'photo2.jpg',
                images: ['photo3.jpg', 'photo4.jpg'],
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

    it('should filter houses by mainImage', async () => {
        const response = await request
            .get('/api/houses')
            .query({ mainImage: 'photo2.jpg' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].mainImage).toBe('photo2.jpg');
    });
});

describe('House save', () => {
    beforeEach(async () => {
        await HouseModel.deleteMany({});
    });

    it('should create a new house and then query it', async () => {
        const house = {
            address: '789 Pine St',
            onHomePage: true,
            isDeveloped: true,
            isForSale: true,
            mainImage: 'photo3.jpg',
            images: ['photo3.jpg', 'photo4.jpg'],
            neighborhood: 'Uptown',
            stats: {
                houseSquareFeet: 2500,
                lotSquareFeet: 6000,
                bedrooms: 4,
                bathrooms: 3,
                garageSpaces: 2,
            }
        };

        // Save the house
        const saveResponse = await request
            .post('/api/houses/save')
            .send(house);

        expect(saveResponse.status).toBe(200);

        // Query the house
        const queryResponse = await request
            .get('/api/houses')
            .query({ address: '789 Pine St' });

        expect(queryResponse.status).toBe(200);
        expect(queryResponse.body).toHaveLength(1);
        const foundHouse = queryResponse.body[0];
        expect(foundHouse.address).toBe('789 Pine St');
        expect(foundHouse.mainImage).toBe('photo3.jpg');
        expect(foundHouse.neighborhood).toBe('Uptown');
    });

    it('should update an existing house and then query it', async () => {
        const existingHouse = await HouseModel.create({
            address: '789 Pine St',
            onHomePage: true,
            isDeveloped: true,
            isForSale: true,
            mainImage: 'photo3.jpg',
            images: ['photo3.jpg', 'photo4.jpg'],
            neighborhood: 'Uptown',
            stats: {
                houseSquareFeet: 2500,
                lotSquareFeet: 6000,
                bedrooms: 4,
                bathrooms: 3,
                garageSpaces: 2,
            }
        });

        const updatedHouse = {
            id: (existingHouse._id as string).toString(),
            address: '789 Pine St',
            onHomePage: false,
            isDeveloped: true,
            isForSale: false,
            mainImage: 'photo4.jpg',
            images: ['photo4.jpg', 'photo5.jpg'],
            neighborhood: 'Uptown',
            stats: {
                houseSquareFeet: 2500,
                lotSquareFeet: 6000,
                bedrooms: 4,
                bathrooms: 3,
                garageSpaces: 2,
            }
        };

        // Update the house
        const updateResponse = await request
            .post('/api/houses/save')
            .send(updatedHouse);

        expect(updateResponse.status).toBe(200);

        // Query the house
        const queryResponse = await request
            .get('/api/houses')
            .query({ address: '789 Pine St' });

        expect(queryResponse.status).toBe(200);
        expect(queryResponse.body).toHaveLength(1);
        const foundHouse = queryResponse.body[0];
        expect(foundHouse.onHomePage).toBe(false);
        expect(foundHouse.isForSale).toBe(false);
        expect(foundHouse.mainImage).toBe('photo4.jpg');
    });
});
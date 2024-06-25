import { AppData, DeepPartial } from "living-mile-high-types";
import { AppDataService } from "../src/types";
import { inMemoryCDN } from "../src/services/utils/createS3CdnService";
import { CdnFixedKeys } from "../src/types/enums";
import { services } from "../src/app";

const DATA_KEY = CdnFixedKeys.AppData;
let appDataService: AppDataService;

beforeAll(() => {
    appDataService = services().appDataService;
})


describe('CdnAppDataService', () => {
    it('should update AppData successfully', async () => {
        const updates: DeepPartial<AppData> = {
            about: { text: 'New About Text', image: 'new-about-image.jpg' },
            contact: { text: 'New Contact Text', image: 'new-contact-image.jpg' },
            houses: [],
            placeholderImages: ['placeholder1'],
            homeImages: ['home-image1.jpg']
        };

        const updatedData = await appDataService.update(updates);

        expect(updatedData).toEqual(updates);
        expect(inMemoryCDN[DATA_KEY].body).toBe(JSON.stringify(updates));
    });

    it('should throw an error if AppData is invalid', async () => {
        const invalidUpdates = {
            contact: { text: 'Existing Contact Text', image: 'existing-contact-image.jpg' },
            houses: [],
            placeholderImages: ['existing-placeholder'],
            homeImages: ['existing-home-image.jpg'],
            about: { text: 'New About Text' }
        }; // Missing image property

        await expect(appDataService.update(invalidUpdates as DeepPartial<AppData>))
            .rejects
            .toThrow('AboutData image must be a string');
    });

    it('should merge updates with existing data', async () => {
        const existingData: AppData = {
            about: { text: 'Existing About Text', image: 'existing-about-image.jpg' },
            contact: { text: 'Existing Contact Text', image: 'existing-contact-image.jpg' },
            houses: [],
            placeholderImages: ['existing-placeholder'],
            homeImages: ['existing-home-image.jpg']
        };
        inMemoryCDN[DATA_KEY] = { body: JSON.stringify(existingData), contentType: 'application/json' };

        const updates: DeepPartial<AppData> = {
            about: { text: 'Updated About Text' }
        };

        const updatedData = await appDataService.update(updates);

        expect(updatedData).toEqual({
            ...existingData,
            about: { text: 'Updated About Text', image: 'existing-about-image.jpg' }
        });
        expect(inMemoryCDN[DATA_KEY].body).toBe(JSON.stringify({
            ...existingData,
            about: { text: 'Updated About Text', image: 'existing-about-image.jpg' }
        }));
    });

    it('should throw an error if required properties are missing', async () => {
        const invalidUpdates = { homeImages: ['new-home-image.jpg'] }; // Missing other required properties

        await expect(appDataService.update(invalidUpdates as DeepPartial<AppData>))
            .rejects
            .toThrow('Missing required property: about');
    });
});
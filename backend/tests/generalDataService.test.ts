import { services } from "~/di";
import { GeneralDataService } from "~/@types";
import { DefaultGeneralData } from "living-mile-high-lib";

let generalDataService: GeneralDataService;

beforeAll(() => {
    ({ generalDataService } = services());
});

describe('GeneralDataService', () => {
    test('should get singleton document and create default if not exists', async () => {
        const result = await generalDataService.getGeneralData();

        expect(result).toEqual(DefaultGeneralData);
    });

    test('should update existing general data', async () => {
        const aboutText = 'new text';
        const contactImage = 'https://example.com/new-image.jpg';
        const updates = {
            about: {
                text: aboutText,
            },
            contact: {
                image: contactImage,
            }
        };

        const expected = {
            ...DefaultGeneralData,
            about: {
                ...DefaultGeneralData.about,
                text: aboutText,
            },
            contact: {
                ...DefaultGeneralData.contact,
                image: contactImage,
            },
        };

        await generalDataService.update(updates);

        const actual = await generalDataService.getGeneralData();
        expect(actual).toEqual(expected);
    });
})
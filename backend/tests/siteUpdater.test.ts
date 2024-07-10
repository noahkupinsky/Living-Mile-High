import { SiteData } from "living-mile-high-lib";
import { services } from "../src/app";
import { CdnAdapter } from "../src/types";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
});

const mockSiteData: SiteData = {
    homeImages: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    about: {
        text: 'about',
        image: 'https://example.com/image3.jpg'
    },
    contact: {
        text: 'contact',
        image: 'https://example.com/image4.jpg'
    },
    defaultImages: ['https://example.com/image5.jpg', 'https://example.com/image6.jpg'],
    houses: [
        {
            address: 'House 1',
            mainImage: 'https://example.com/image7.jpg',
            images: ['https://example.com/image8.jpg', 'https://example.com/image9.jpg'],
            isDeveloped: true,
            isSelectedWork: true,
            isForSale: true,
            neighborhood: 'Neighborhood 1',
            stats: {}
        },
    ]
}

describe('SiteUpdater', () => {
    test('should update site data', async () => {

    });
});
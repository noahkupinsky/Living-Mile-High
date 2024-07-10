import { SiteData } from "living-mile-high-lib";
import { services } from "../src/app";
import { CdnAdapter } from "../src/types";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
});


describe('SiteUpdater', () => {
    test('should update site data', async () => {

    });
});
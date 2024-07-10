import { SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { CdnAdapter } from "~/@types";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
});


describe('SiteUpdater', () => {
    test('should update site data', async () => {

    });
});
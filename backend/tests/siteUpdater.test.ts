import { CdnKeys, DefaultGeneralData, DefaultHomePageImages, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { CdnAdapter, SiteUpdater } from "~/@types";
import { combineSiteData } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { Readable } from "stream";
import { downloadImage } from "~/services/CdnSiteUpdater";

let cdn: CdnAdapter;
let siteUpdater: SiteUpdater;

beforeAll(() => {
    cdn = services().cdnAdapter;
    siteUpdater = services().siteUpdater;
});


describe('SiteUpdater', () => {
    test('should update site data', async () => {

    });

    test('updateSiteData should update site data', async () => {
        await siteUpdater.updateSiteData();

        const expectedSiteData = combineSiteData(DefaultGeneralData, []);
        const siteDataString = inMemoryCdn[CdnKeys.SITE_DATA].body;

        const siteData = JSON.parse(siteDataString) as SiteData;

        const expectedHomePageFirst = (await downloadImage(DefaultHomePageImages[0])).buffer;
        const homePageFirst = inMemoryCdn[CdnKeys.HOME_PAGE_FIRST].body;

        expect(siteData).toEqual(expectedSiteData);
        expect(homePageFirst).toEqual(expectedHomePageFirst);
    });
});
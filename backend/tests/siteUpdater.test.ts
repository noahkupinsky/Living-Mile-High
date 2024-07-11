import { CdnKeys, DefaultGeneralData, DefaultHomePageImages, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { CdnAdapter, SiteUpdater } from "~/@types";
import { combineSiteData } from "~/utils/misc";

let cdn: CdnAdapter;
let siteUpdater: SiteUpdater;

beforeAll(() => {
    cdn = services().cdnAdapter;
    siteUpdater = services().siteUpdater;
});

function parseBody(content: any): any {
    return content.body;
}

describe('SiteUpdater', () => {
    test('should update site data', async () => {

    });

    // test('updateSiteData should update site data', async () => {
    //     await siteUpdater.updateSiteData();

    //     const { Body } = await cdn.getObject(CdnKeys.siteData);
    //     console.log(Body);
    //     expect(Body).not.toBeNull();

    //     const expectedSiteData = combineSiteData(DefaultGeneralData, []);
    //     const siteData = parseBody(inMemoryCDN[CdnKeys.siteData]);

    //     const expectedHomePageFirst = DefaultHomePageImages[0];
    //     const homePageFirst = parseBody(inMemoryCDN[CdnKeys.homePageFirst]);

    //     expect(siteData).toEqual(expectedSiteData);
    //     expect(homePageFirst).toEqual(expectedHomePageFirst);
    // });

    // test('updateHomePageFirst should update home first image', async () => {
    //     const homePageImages = ['http://example.com/image.jpg'];

    //     await siteUpdater.updateHomePageFirst(homePageImages);

    //     const [cdnObject] = await cdn.getObject(CdnKeys.homePageFirst);

    //     expect(cdnObject).not.toBeNull();
    // });

});
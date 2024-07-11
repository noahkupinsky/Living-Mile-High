import { CdnKeys, DefaultGeneralData, DefaultHomePageImages, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { CdnAdapter, SiteUpdater } from "~/@types";
import { combineSiteData, prefixKey, unprefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { downloadImage } from "~/services/CdnSiteUpdater";
import { ContentPrefix, ContentType } from "~/@types/constants";

let cdn: CdnAdapter;
let siteUpdater: SiteUpdater;

beforeAll(() => {
    cdn = services().cdnAdapter;
    siteUpdater = services().siteUpdater;
});

describe('SiteUpdater', () => {
    test('updateSiteData should update site data', async () => {
        await siteUpdater.updateSiteData();

        const expectedSiteData = combineSiteData(DefaultGeneralData, []);
        const siteDataString = inMemoryCdn[CdnKeys.SITE_DATA].body;

        const siteData = JSON.parse(siteDataString) as SiteData;

        expect(siteData).toEqual(expectedSiteData);
    });

    test('updateSiteData should update home first', async () => {
        await siteUpdater.updateSiteData();

        const expectedHomePageFirst = (await downloadImage(DefaultHomePageImages[0])).buffer;
        const homePageFirst = inMemoryCdn[CdnKeys.HOME_PAGE_FIRST].body;

        expect(homePageFirst).toEqual(expectedHomePageFirst);
    });

    test('listBackups should list backups', async () => {
        const name = "Hello World";

        cdn.putObject({
            key: 'key',
            body: 'body',
            contentType: ContentType.JSON,
            prefix: ContentPrefix.BACKUP,
            metadata: {
                name: name
            }
        });

        const backups = await siteUpdater.listBackups();

        expect(backups).toEqual([name]);
    });
});
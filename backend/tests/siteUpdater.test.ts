import { CdnKeys, DefaultGeneralData, DefaultHomePageImages, SiteData } from "living-mile-high-lib";
import { services } from "~/di";
import { BackupService } from "~/@types";
import { combineSiteData, downloadImage } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { updateSiteData } from "~/controllers/siteUpdateController";

let backupService: BackupService;

beforeAll(() => {
    ({ backupService } = services());
});

describe('SiteUpdater', () => {
    test('updateSiteData should update site data', async () => {
        await updateSiteData();

        const expectedSiteData = combineSiteData(DefaultGeneralData, []);
        const siteDataString = inMemoryCdn[CdnKeys.SITE_DATA].body;

        const siteData = JSON.parse(siteDataString) as SiteData;

        expect(siteData).toEqual(expectedSiteData);
    });

    test('updateSiteData should update home first', async () => {
        await updateSiteData();

        const expectedHomePageFirst = (await downloadImage(DefaultHomePageImages[0])).buffer;
        const homePageFirst = inMemoryCdn[CdnKeys.HOME_PAGE_FIRST].body;

        expect(homePageFirst).toEqual(expectedHomePageFirst);
    });

    test('updateSiteData should produce an automatic backup', async () => {
        await updateSiteData();

        const backups = await backupService.getBackupIndices();

        expect(backups).toHaveLength(1);
    });
});
import { SiteData, DeepPartial } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";

export const updateDataAndBroadcast = async (updates: DeepPartial<SiteData>) => {
    const { siteUpdater, generalDataService } = services();
    await generalDataService.update(updates);
    await siteUpdater.updateSiteData();
}

export const updateGeneralData: ExpressEndpoint = async (req, res) => {
    const updates = req.body;
    try {
        await updateDataAndBroadcast(updates);
        res.json({ success: true });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
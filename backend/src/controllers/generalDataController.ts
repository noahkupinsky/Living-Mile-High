import { SiteData, DeepPartial } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateFixedKeys } from "./cdnController";

export const updateDataAndBroadcast = async (updates: DeepPartial<SiteData>) => {
    const { generalDataService } = services();
    await generalDataService.update(updates);
    await updateFixedKeys();
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
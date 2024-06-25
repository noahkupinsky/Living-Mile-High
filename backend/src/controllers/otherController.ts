import { ExpressEndpoint } from "../types";
import { services } from "../app";
import { AppData, DeepPartial } from "living-mile-high-lib";

export const updateDataAndBroadcast = async (updates: DeepPartial<AppData>) => {
    const { appDataService, otherService } = services();
    await otherService.update(updates);
    await appDataService.update();
}

export const updateOtherData: ExpressEndpoint = async (req, res) => {
    const updates = req.body;
    try {
        await updateDataAndBroadcast(updates);
        res.json({ success: true });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
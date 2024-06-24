import { ExpressEndpoint } from "src/types";
import { services } from "../app";
import { AppData, DeepPartial } from "living-mile-high-types";

export const updateDataAndBroadcast = async (updates: DeepPartial<AppData>) => {
    const { appDataService, webSocketService } = services();
    await appDataService.update(updates);
    webSocketService.broadcast("Updated App Data");
}

export const updateAppData: ExpressEndpoint = async (req, res) => {
    const updates = req.body;
    try {
        await updateDataAndBroadcast(updates);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const garbageCollect: ExpressEndpoint = async (req, res) => {
    const { appDataService } = services();
    const numGarbageCollected = await appDataService.garbageCollect();
    res.json({ success: true, numGarbageCollected });
}
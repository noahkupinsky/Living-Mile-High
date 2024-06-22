import { ExpressEndpoint } from "src/types";
import { services } from "../app";

const appDataService = () => services().appDataService;

export const updateAppData: ExpressEndpoint = async (req, res) => {
    const updates = req.body;
    try {
        await appDataService().update(updates);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}
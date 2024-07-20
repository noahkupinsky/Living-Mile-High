import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateSite } from "./updateController";

const generalDataService = () => services().generalDataService;

export const updateGeneralData: ExpressEndpoint = async (req, res) => {
    const { data } = req.body;
    try {
        await generalDataService().update(data);
        await updateSite();
        res.json({ success: true });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
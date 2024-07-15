import { House } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateSite } from "./updateController";

const houseService = () => services().houseService;

export const getHouses: ExpressEndpoint = async (req, res) => {
    try {
        const houses = await houseService().getHouseObjects();
        res.status(200).json(houses);
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const upsertHouse: ExpressEndpoint = async (req, res) => {
    const house: House = req.body;

    try {
        await houseService().upsertHouse(house);
        await updateSite();
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

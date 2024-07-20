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
    const { house } = req.body;

    try {
        const id = await houseService().upsertHouse(house);
        await updateSite();
        res.json({ success: true, id });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const deleteHouse: ExpressEndpoint = async (req, res) => {
    const { id } = req.body;

    try {
        const success = await houseService().deleteHouse(id);
        await updateSite();
        res.json({ success });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

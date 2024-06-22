import { House } from "living-mile-high-types";
import { ExpressEndpoint } from "../types";
import { services } from "../app";

const houseService = () => services().houseService;

export const getHouses: ExpressEndpoint = async (req, res) => {
    try {
        const houses = await houseService().getHouses();
        res.status(200).json(houses);
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const saveHouse: ExpressEndpoint = async (req, res) => {
    const house: House = req.body;
    try {
        await houseService().saveHouse(house);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

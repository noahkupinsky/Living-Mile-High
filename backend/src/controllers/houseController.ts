import { House, HouseQuery } from "living-mile-high-types";
import { ExpressEndpoint } from "../@types";
import { getService } from "../app";

export const findHouses: ExpressEndpoint = async (req, res) => {
    const houseFilter: HouseQuery = req.query;
    const houses = await getService('house').findHouses(houseFilter);
    res.json(houses);
}

export const saveHouse: ExpressEndpoint = async (req, res) => {
    const house: House = req.body;
    try {
        await getService('house').saveHouse(house);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

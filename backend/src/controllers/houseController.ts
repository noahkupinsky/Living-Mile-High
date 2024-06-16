import { House, HouseQuery } from "living-mile-high-types";
import { ExpressEndpoint } from "../@types";
import { getService } from "../app";

export const findHouses: ExpressEndpoint = async (req, res) => {
    const houseService = getService('house');
    const houseFilter: HouseQuery = req.query;
    const houses = await houseService.findHouses(houseFilter);
    res.json(houses);
}
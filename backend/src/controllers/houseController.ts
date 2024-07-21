import { DeleteHouseRequest, DeleteHouseResponse, generateSiteUpdateId, House, UpsertHouseRequest, UpsertHouseResponse } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateSite } from "./updateController";

const houseService = () => services().houseService;

export const upsertHouse: ExpressEndpoint = async (req, res) => {
    const body: UpsertHouseRequest = req.body;
    const { house, siteUpdateId } = body;
    const resUpdateId = generateSiteUpdateId(siteUpdateId);

    try {
        const id = await houseService().upsertHouse(house);
        await updateSite();

        const successResponse: UpsertHouseResponse = { success: true, siteUpdateId: resUpdateId, id: id };
        res.json(successResponse);
    } catch (error: any) {

        const errorResponse: UpsertHouseResponse = { success: false, siteUpdateId: resUpdateId, error: error.message };
        res.status(500).json(errorResponse);
    }
}

export const deleteHouse: ExpressEndpoint = async (req, res) => {
    const body: DeleteHouseRequest = req.body;
    const { id, siteUpdateId } = body;
    const resUpdateId = generateSiteUpdateId(siteUpdateId);

    try {
        const success = await houseService().deleteHouse(id);
        await updateSite();

        const booleanResponse: DeleteHouseResponse = { success: success, siteUpdateId: resUpdateId };
        res.json(booleanResponse);
    } catch (error: any) {
        const errorResponse: DeleteHouseResponse = { success: false, siteUpdateId: resUpdateId, error: error.message };
        res.status(500).json(errorResponse);
    }
}
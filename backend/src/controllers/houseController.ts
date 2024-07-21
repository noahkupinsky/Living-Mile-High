import { DeleteHouseRequest, DeleteHouseResponse, generateEventId, UpsertHouseRequest, UpsertHouseResponse } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateSite } from "./updateController";

const houseService = () => services().houseService;

export const upsertHouse: ExpressEndpoint = async (req, res) => {
    const body: UpsertHouseRequest = req.body;
    const { house, eventId: optionalEventId } = body;
    const eventId = generateEventId(optionalEventId);

    try {
        const id = await houseService().upsertHouse(house);
        await updateSite(eventId);

        const successResponse: UpsertHouseResponse = { success: true, id: id };
        res.json(successResponse);
    } catch (error: any) {

        const errorResponse: UpsertHouseResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}

export const deleteHouse: ExpressEndpoint = async (req, res) => {
    const body: DeleteHouseRequest = req.body;
    const { id, eventId: optionalEventId } = body;
    const eventId = generateEventId(optionalEventId);

    try {
        const success = await houseService().deleteHouse(id);
        await updateSite(eventId);

        const booleanResponse: DeleteHouseResponse = { success: success };
        res.json(booleanResponse);
    } catch (error: any) {
        const errorResponse: DeleteHouseResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}
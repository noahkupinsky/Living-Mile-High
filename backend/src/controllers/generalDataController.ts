import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";
import { updateSite } from "./updateController";
import { UpdateGeneralDataRequest, UpdateGeneralDataResponse } from "living-mile-high-lib";

const generalDataService = () => services().generalDataService;

export const updateGeneralData: ExpressEndpoint = async (req, res) => {
    const body: UpdateGeneralDataRequest = req.body;
    const { data } = body;

    try {
        await generalDataService().update(data);
        await updateSite();

        const successResponse: UpdateGeneralDataResponse = { success: true };
        res.json(successResponse);
    } catch (error: any) {

        const errorResponse: UpdateGeneralDataResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}
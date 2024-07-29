import { generateEventId, UploadAssetResponse } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";

const assetService = () => services().assetService;

export const uploadAsset: ExpressEndpoint = async (req, res) => {
    const file = req.file;

    try {
        const url = await assetService().uploadAsset(file);

        const successResponse: UploadAssetResponse = { success: true, url: url };
        res.json(successResponse);
    } catch (error: any) {
        console.log(error.message);
        const errorResponse: UploadAssetResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
}
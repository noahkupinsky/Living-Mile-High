import { generateSiteUpdateId, UploadAssetResponse } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";

const assetService = () => services().assetService;

export const uploadAsset: ExpressEndpoint = async (req, res) => {
    const file = req.file;
    const { siteUpdateId } = req.body;
    const resUpdateId = generateSiteUpdateId(siteUpdateId);

    try {
        const url = await assetService().uploadAsset(file);

        const successResponse: UploadAssetResponse = { success: true, siteUpdateId: resUpdateId, url: url };
        res.json(successResponse);
    } catch (error: any) {
        const errorResponse: UploadAssetResponse = { success: false, siteUpdateId: resUpdateId, error: error.message };
        res.status(500).json(errorResponse);
    }
}
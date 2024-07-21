import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";

const imageService = () => services().assetService;

export const uploadImage: ExpressEndpoint = async (req, res) => {
    const file = req.file;

    try {
        const imageUrl = await imageService().uploadAsset(file);
        res.json({ imageUrl });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
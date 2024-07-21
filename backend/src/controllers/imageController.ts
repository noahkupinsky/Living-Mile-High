import { UploadImageRequest } from "living-mile-high-lib";
import { ExpressEndpoint } from "~/@types";
import { services } from "~/di";

const imageService = () => services().imageService;

export const uploadImage: ExpressEndpoint = async (req, res) => {
    const body: UploadImageRequest = req.body;
    const file = body.file;

    try {
        const imageUrl = await imageService().uploadImage(file);
        res.json({ imageUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
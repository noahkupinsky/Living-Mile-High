import services from "@/di";
import { ImageFormat } from "@/types";

export const processImage = async (image: ImageFormat): Promise<string | undefined> => {
    const { apiService } = services();
    if (typeof image === 'string') {
        return image;
    }
    try {
        const uploadedUrl = await apiService.uploadAsset(image);
        return uploadedUrl;
    } catch (e) {
        alert(`Failed to save image ${image.name}: ${e}`);
        return undefined;
    }
}
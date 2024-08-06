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
        alert(`Failed to save image ${('name' in image) ? image.name : ''}: ${e}`);
        return undefined;
    }
}

export const binaryStringToBytes = (binaryString: string): Uint8Array => {
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
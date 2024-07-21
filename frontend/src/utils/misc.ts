import { ImageFormat } from "@/types";

export const imageFormatToUrl = (image: ImageFormat): string => {
    if (typeof image === 'string') {
        return image;
    } else {
        return URL.createObjectURL(image);
    }
}
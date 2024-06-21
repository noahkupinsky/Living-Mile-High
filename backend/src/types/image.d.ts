import { ImageCategory } from "./enums";

export interface ImageService {
    uploadImage(file: any, category: ImageCategory = ImageCategory.Houses): Promise<string>;
}
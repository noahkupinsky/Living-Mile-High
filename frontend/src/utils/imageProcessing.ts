import services from "@/di";
import axios from "axios";
import { ImageFormat } from "@/types";
import { env } from "next-runtime-env";
import {
    listOfFiles,
    Paginator,
    UploadcareAuthSchema,
    deleteFiles,
} from "@uploadcare/rest-client";

const uploadcarePublic = () => env('NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY')!;

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

export const downloadImage = async (url: string): Promise<File> => {
    // Download the image from Uploadcare
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = response.data;
    const contentType = response.headers['content-type'];

    // Create a File object from the blob
    const fileExtension = contentType.split('/')[1];
    const file = new File([blob], `image.${fileExtension}`, { type: contentType });
    return file;
}

export const clearUploadcare = async (): Promise<void> => {
    const { apiService } = services();
    const uploadcareAuthShema = new UploadcareAuthSchema({
        publicKey: uploadcarePublic(),
        signatureResolver: async (signString) => {
            return await apiService.signUploadcareRequest(signString);
        }
    });

    try {
        const allFileUuids: string[] = [];

        // List all files and collect their UUIDs
        const paginator = new Paginator(listOfFiles, {}, { authSchema: uploadcareAuthShema })

        while (paginator.hasNextPage()) {
            const page = await paginator.next();
            const pageUuids = page!.results.map(file => file.uuid);
            allFileUuids.push(...pageUuids);
        }

        await deleteFiles({ uuids: allFileUuids }, { authSchema: uploadcareAuthShema });
    } catch (error) {
        console.error('Error clearing Uploadcare files:', error);
    }
};
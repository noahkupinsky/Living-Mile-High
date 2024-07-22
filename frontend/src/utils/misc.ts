import { ImageFormat } from "@/types";

export const imageFormatToUrl = (image: ImageFormat): string => {
    if (typeof image === 'string') {
        return image;
    } else {
        return URL.createObjectURL(image);
    }
}

export const objectsEqualTimestampless = (obj1: any, obj2: any): boolean => {
    return objectsEqual(timestampless(obj1), timestampless(obj2));
}

function timestampless(obj: any) {
    return { ...obj, createdAt: undefined, updatedAt: undefined };
}

export function objectsEqual(obj1: any, obj2: any) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key) || !objectsEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}
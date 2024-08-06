import { ImageFormat } from "@/types";
import validator from "validator";

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

export const requestAnimationFrames = (callback: () => void, number: number = 2) => {
    if (number === 0) {
        callback();
        return;
    }

    requestAnimationFrame(() => {
        requestAnimationFrames(callback, number - 1);
    })
}

export function minV(x: number): string {
    return `min(${x}vw, ${x}vh)`;
}

export function makeRows<T>(array: T[], columns: number): T[][] {
    const rows: T[][] = [];
    for (let i = 0; i < array.length; i += columns) {
        rows.push(array.slice(i, i + columns));
    }
    return rows;
}
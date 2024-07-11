import { GeneralData, House, SiteData } from "living-mile-high-lib";
import { ContentPrefix } from "~/@types/constants";

export function constructUpdateObject(obj: any, prefix = ''): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, constructUpdateObject(obj[key], newKey));
        } else {
            acc[newKey] = obj[key];
        }
        return acc;
    }, ({} as any));
}


export function prefixKey(key: string, prefix?: ContentPrefix): string {
    return prefix ? `${prefix}-${key}` : key;
}

export function unprefixKey(key: string): string {
    for (const prefix of Object.values(ContentPrefix)) {
        if (key.startsWith(prefix)) {
            return key.slice(prefix.length + 1);
        }
    }
    return key;
}

export function combineSiteData(generalData: GeneralData, houses: House[]): SiteData {
    return {
        ...generalData,
        houses
    };
}
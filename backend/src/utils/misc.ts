import axios from "axios";
import { EventMessage, GeneralData, House, SiteData } from "living-mile-high-lib";
import { Readable } from "stream";
import { CdnMetadata } from "~/@types";
import { ContentCategory, ContentType } from "~/@types/constants";

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


export function prefixKey(key: string, prefix?: ContentCategory): string {
    return prefix ? `${prefix}-${key}` : key;
}

export function unprefixKey(key: string): string {
    for (const prefix of Object.values(ContentCategory)) {
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

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

export async function streamToString(stream: Readable): Promise<string> {
    const buffer = await streamToBuffer(stream);
    return buffer.toString('utf-8');
}

export async function streamToParsedJson(stream: Readable): Promise<any> {
    return JSON.parse(await streamToString(stream));
}

export async function downloadImage(url: string): Promise<{ buffer: Buffer, contentType: ContentType }> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        buffer: Buffer.from(response.data),
        contentType: response.headers['content-type']
    };
}

export function formatEventMessage(message: EventMessage): string {
    return `data: ${message}\n\n`;
}

export const prefixMetadata = (metadata: CdnMetadata): { [key: string]: string } => {
    const prefixedMetadata: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(metadata)) {
        prefixedMetadata[`x-amz-meta-${key}`] = value;
    }
    return prefixedMetadata;
};

export const unprefixMetadata = (metadata: { [key: string]: string }): CdnMetadata => {
    const unprefixedMetadata: any = {};
    for (const [key, value] of Object.entries(metadata)) {
        if (key.startsWith('x-amz-meta-')) {
            const unprefixedKey = key.slice(11);
            unprefixedMetadata[unprefixedKey] = value;
        }
    }
    return unprefixedMetadata;
};
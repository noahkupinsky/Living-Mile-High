import { AppData, DeepPartial } from 'living-mile-high-types';
import { CdnFixedKeys } from '../../types/enums';
import { AppDataService, CdnAdapter } from '../../types';
import { AppDataValidator } from '../utils/AppDataValidator';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

function deepMerge<T>(target: T, source: Partial<T>): T {
    const output = { ...target };

    if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
        Object.keys(source).forEach(key => {
            const targetValue = (target as any)[key];
            const sourceValue = (source as any)[key];

            if (sourceValue instanceof Array) {
                (output as any)[key] = sourceValue; // Replace arrays
            } else if (typeof sourceValue === 'object' && sourceValue !== null) {
                if (!(key in target)) {
                    (output as any)[key] = sourceValue;
                } else {
                    (output as any)[key] = deepMerge(targetValue, sourceValue);
                }
            } else {
                (output as any)[key] = sourceValue;
            }
        });
    }

    return output;
}

class CdnAppDataService implements AppDataService {
    private cdn: CdnAdapter;
    private dataKey: string = CdnFixedKeys.AppData;

    constructor(cdn: CdnAdapter) {
        this.cdn = cdn;
    }


    public async update(updates: DeepPartial<AppData>): Promise<AppData> {
        const objectKey = CdnFixedKeys.AppData;
        const existingData = await this.getData();
        const updatedData = deepMerge(existingData, updates);

        if (!AppDataValidator.validate(updatedData)) {
            throw new Error('Invalid AppData');
        }

        const putObjectSuccess = await this.cdn.putObject(objectKey, JSON.stringify(updatedData), 'application/json');
        if (!putObjectSuccess) {
            throw new Error('Failed to update AppData in CDN');
        }

        return updatedData;
    }

    public async getData(): Promise<DeepPartial<AppData>> {
        try {
            const objectKey = CdnFixedKeys.AppData;
            const data: GetObjectCommandOutput = await this.cdn.getObject(objectKey);

            const bodyString = await this.getBodyString(data.Body);
            return JSON.parse(bodyString);
        } catch (error: any) {
            // console.error(`Failed to get AppData from CDN: ${error.message}`);
            return {};
        }
    }

    private async getBodyString(body: any): Promise<string> {
        if (body instanceof Readable) {
            return this.streamToString(body);
        } else if (Buffer.isBuffer(body)) {
            return body.toString('utf-8');
        } else if (typeof body === 'string') {
            return body;
        } else {
            throw new Error('Unexpected data.Body type');
        }
    }

    private async streamToString(stream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf-8'));
            });
        });
    }
}

export default CdnAppDataService
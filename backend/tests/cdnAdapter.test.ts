import { S3Client, CreateBucketCommand, PutObjectCommand, GetObjectCommand, ListBucketsCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

import { CdnAdapter } from "~/@types";
import { ContentPrefix } from "~/@types/constants";
import { services } from "~/di";
import { prefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/memoryCdn";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
});

describe('S3Service', () => {
    it('should upload an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';

        await expect(cdn.putObject(key, body, contentType)).resolves.not.toThrow();
        expect(inMemoryCdn[key]).toEqual({ body: Buffer.from(body), metadata: {} });
    });

    it('should upload an object with a prefix', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';
        const prefix = ContentPrefix.asset;

        const prefixedKey = prefixKey(key, prefix);

        await expect(cdn.putObject(key, body, contentType, prefix)).resolves.not.toThrow();
        expect(inMemoryCdn[prefixedKey]).toEqual({ body: Buffer.from(body), metadata: {} });
    });

    it('should get an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';
        inMemoryCdn[key] = {
            body: Buffer.from(body),
            metadata: {},
        };

        const result = await cdn.getObject(key);
        expect(result.Body).toEqual(Buffer.from(body));
    });

    it('should delete an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';
        inMemoryCdn[key] = {
            body: Buffer.from(body),
            metadata: {},
        };

        await expect(cdn.deleteObject(key)).resolves.not.toThrow();
        expect(inMemoryCdn[key]).toBeUndefined();
    });

    it('should list all keys', async () => {
        inMemoryCdn['key1'] = {
            body: Buffer.from('body1'),
            metadata: {},
        };
        inMemoryCdn['key2'] = {
            body: Buffer.from('body2'),
            metadata: {},
        };

        const keys = await cdn.getKeys();
        expect(keys).toEqual(['key1', 'key2']);
    });

    it('should list specific prefix keys', async () => {
        const prefix = ContentPrefix.asset;
        const prefixedKey = prefixKey('key1', prefix);
        inMemoryCdn[prefixedKey] = {
            body: Buffer.from('body1'),
            metadata: {},
        };
        inMemoryCdn['key2'] = {
            body: Buffer.from('body2'),
            metadata: {},
        };

        const keys = await cdn.getKeys(prefix);

        expect(keys).toEqual([prefixedKey]);
    });
});


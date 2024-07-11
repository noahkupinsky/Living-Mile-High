import { CdnAdapter, CdnMetadata } from "~/@types";
import { ContentPrefix, ContentType } from "~/@types/constants";
import { services } from "~/di";
import { prefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { Readable } from "stream";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
});

describe('S3Service', () => {
    it('should upload an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = ContentType.TEXT;

        await expect(cdn.putObject({ key, body, contentType })).resolves.not.toThrow();

        const { body: resultBody, contentType: resultContentType } = inMemoryCdn[key];

        expect(resultBody).toEqual(body);
        expect(resultContentType).toEqual(contentType);
    });

    it('should upload an object with a prefix', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = ContentType.TEXT;
        const prefix = ContentPrefix.ASSET;

        const prefixedKey = prefixKey(key, prefix);

        await expect(cdn.putObject({
            key,
            body,
            contentType,
            prefix
        })).resolves.not.toThrow();

        const { body: resultBody, contentType: resultContentType } = inMemoryCdn[prefixedKey];

        expect(resultBody).toEqual(body);
        expect(resultContentType).toEqual(contentType);
    });

    it('should delete an object', async () => {
        const key = 'key';
        cdn.putObject({
            key,
            body: 'body',
            contentType: ContentType.TEXT
        });

        await expect(cdn.deleteObject(key)).resolves.not.toThrow();
        expect(inMemoryCdn[key]).toBeUndefined();
    });

    it('should list all keys', async () => {
        const key1 = 'key1';
        cdn.putObject({
            key: key1,
            body: 'body',
            contentType: ContentType.TEXT
        });
        const key2 = 'key2';
        cdn.putObject({
            key: key2,
            body: 'body',
            contentType: ContentType.TEXT
        });

        const keys = await cdn.getKeys();
        expect(keys).toEqual([key1, key2]);
    });

    it('should list specific prefix keys', async () => {
        const prefix = ContentPrefix.ASSET;

        const prefixedKey = prefixKey('key1', prefix);

        cdn.putObject({
            key: 'key1',
            body: 'body1',
            contentType: ContentType.TEXT,
            prefix: prefix
        });
        cdn.putObject({
            key: 'key2',
            body: 'body2',
            contentType: ContentType.TEXT,
        });

        const keys = await cdn.getKeys(prefix);

        expect(keys).toEqual([prefixedKey]);
    });

    it('should get a single object correctly', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';
        const metadata = { key1: 'value1' };

        inMemoryCdn[key] = {
            body,
            contentType,
            metadata
        };

        const result = await cdn.getObjects(key);

        expect(result).toHaveLength(1);
        expect(result[0].key).toBe(key);
        expect(result[0].contentType).toBe(contentType);
        expect(result[0].metadata).toEqual(metadata);

        const stream = result[0].body as Readable;
        let receivedBody = '';
        for await (const chunk of stream) {
            receivedBody += chunk;
        }

        expect(receivedBody).toBe(body);
    });

    it('should get multiple objects correctly', async () => {
        const keys = ['key1', 'key2'];
        const bodies = ['body1', 'body2'];
        const contentTypes = ['text/plain', 'application/json'];
        const metadatas: CdnMetadata[] = [{ name: 'name1' }, { name: 'name2' }];

        keys.forEach((key, index) => {
            inMemoryCdn[key] = {
                body: bodies[index],
                contentType: contentTypes[index],
                metadata: metadatas[index]
            };
        });

        const result = await cdn.getObjects(keys);

        expect(result).toHaveLength(2);

        for (const [index, object] of result.entries()) {
            expect(object.key).toBe(keys[index]);
            expect(object.contentType).toBe(contentTypes[index]);
            expect(object.metadata).toEqual(metadatas[index]);

            const stream = object.body as Readable;
            let receivedBody = '';
            for await (const chunk of stream) {
                receivedBody += chunk;
            }

            expect(receivedBody).toBe(bodies[index]);
        }
    });

    it('should handle non-existent keys gracefully', async () => {
        const key = 'non-existent-key';

        await expect(cdn.getObjects(key)).rejects.toThrow(`Failed to get object ${key}`);
    });
});


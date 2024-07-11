import { CdnAdapter } from "~/@types";
import { ContentPrefix, ContentType } from "~/@types/constants";
import { services } from "~/di";
import { prefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
});

describe('S3Service', () => {
    it('should upload an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = ContentType.TEXT;

        await expect(cdn.putObject(key, body, contentType)).resolves.not.toThrow();

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

        await expect(cdn.putObject(key, body, contentType, prefix)).resolves.not.toThrow();

        const { body: resultBody, contentType: resultContentType } = inMemoryCdn[prefixedKey];

        expect(resultBody).toEqual(body);
        expect(resultContentType).toEqual(contentType);
    });

    it('should delete an object', async () => {
        const key = 'key';
        cdn.putObject(key, 'body', ContentType.TEXT);

        await expect(cdn.deleteObject(key)).resolves.not.toThrow();
        expect(inMemoryCdn[key]).toBeUndefined();
    });

    it('should list all keys', async () => {
        cdn.putObject('key1', 'body1', ContentType.TEXT);
        cdn.putObject('key2', 'body2', ContentType.TEXT);

        const keys = await cdn.getKeys();
        expect(keys).toEqual(['key1', 'key2']);
    });

    it('should list specific prefix keys', async () => {
        const prefix = ContentPrefix.ASSET;

        const prefixedKey = prefixKey('key1', prefix);

        cdn.putObject('key1', 'body1', ContentType.TEXT, prefix);
        cdn.putObject('key2', 'body2', ContentType.TEXT);

        const keys = await cdn.getKeys(prefix);

        expect(keys).toEqual([prefixedKey]);
    });
});


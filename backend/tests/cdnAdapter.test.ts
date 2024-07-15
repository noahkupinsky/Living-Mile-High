import { CdnAdapter, CdnMetadata } from "~/@types";
import { ContentCategory, ContentPermission, ContentType } from "~/@types/constants";
import { services } from "~/di";
import { prefixKey } from "~/utils/misc";
import { inMemoryCdn } from "~/utils/inMemoryCdn";
import { Readable } from "stream";
import { CdnFixedKey } from "living-mile-high-lib";

let cdn: CdnAdapter;

beforeAll(() => {
    ({ cdnAdapter: cdn } = services());
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
        const prefix = ContentCategory.ASSET;

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
        await cdn.putObject({
            key,
            body: 'body',
            contentType: ContentType.TEXT
        });

        await expect(cdn.deleteObject(key)).resolves.not.toThrow();
        expect(inMemoryCdn[key]).toBeUndefined();
    });

    it('should list all keys', async () => {
        const key1 = 'key1';
        await cdn.putObject({
            key: key1,
            body: 'body',
            contentType: ContentType.TEXT
        });
        const key2 = 'key2';
        await cdn.putObject({
            key: key2,
            body: 'body',
            contentType: ContentType.TEXT
        });

        const keys = await cdn.getKeys();
        expect(keys).toEqual([key1, key2]);
    });

    it('should list specific prefix keys', async () => {
        const prefix = ContentCategory.ASSET;

        const prefixedKey = prefixKey('key1', prefix);

        await cdn.putObject({
            key: 'key1',
            body: 'body1',
            contentType: ContentType.TEXT,
            prefix: prefix
        });
        await cdn.putObject({
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
        const contentType = ContentType.TEXT;
        const metadata = { key1: 'value1' };

        inMemoryCdn[key] = {
            body,
            contentType,
            metadata
        };

        const result = await cdn.getObject(key);

        expect(result.key).toBe(key);
        expect(result.contentType).toBe(contentType);
        expect(result.metadata).toEqual(metadata);

        const stream = result.body as Readable;
        let receivedBody = '';
        for await (const chunk of stream) {
            receivedBody += chunk;
        }

        expect(receivedBody).toBe(body);
    });

    it('should get multiple objects correctly', async () => {
        const keys = ['key1', 'key2'];
        const bodies = ['body1', 'body2'];
        const contentTypes = [ContentType.TEXT, ContentType.JSON];
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

        await expect(cdn.getObject(key)).rejects.toThrow(`Failed to get object ${key}`);
    });

    it('should update an object metadata', async () => {
        const key = 'key';
        const metadata = { name: 'name' };
        await cdn.putObject({
            key,
            body: 'body',
            contentType: ContentType.TEXT
        });
        await expect(cdn.updateObjectMetadata(key, metadata)).resolves.not.toThrow();
        expect(inMemoryCdn[key].metadata).toEqual(metadata);
    });

    it('should update metadata of an existing object', async () => {
        const key = 'test-key';
        const originalMetadata = { name: 'name', createdAt: 'today' };
        const updatedMetadata = { name: 'updated-name' };

        // Setup in-memory storage
        inMemoryCdn[key] = {
            body: 'test-body',
            contentType: 'text/plain',
            metadata: originalMetadata
        };

        await cdn.updateObjectMetadata(key, updatedMetadata);

        expect(inMemoryCdn[key].metadata).toEqual({ ...originalMetadata, ...updatedMetadata });
    });
});

describe('putObject permissions', () => {
    const createObject = async (key: string, prefix?: ContentCategory): Promise<string> => {
        return await cdn.putObject({
            key: key,
            body: `{"data": "${key}"}`,
            contentType: ContentType.JSON,
            prefix: prefix
        });
    };

    it('should set ACL to public-read for ASSET prefix', async () => {
        const key = await createObject('assetKey', ContentCategory.ASSET);

        expect(inMemoryCdn[key].acl).toBe(ContentPermission.PUBLIC);
    });

    it('should set ACL to public-read for fixed keys with no prefix', async () => {
        const fixedKey = Object.values(CdnFixedKey)[0];
        const key = await createObject(fixedKey);

        expect(inMemoryCdn[key].acl).toBe(ContentPermission.PUBLIC);
    });

    it('should set ACL to private for fixed keys with any non-ASSET prefix, as fixed keys are exclusively prefixless', async () => {
        const fixedKey = Object.values(CdnFixedKey)[0];
        const key = await createObject(fixedKey, ContentCategory.BACKUP);

        expect(inMemoryCdn[key].acl).toBe(ContentPermission.PRIVATE);
    });

    it('should set ACL to private for non-ASSET category', async () => {
        const key = await createObject('anything', ContentCategory.BACKUP);

        expect(inMemoryCdn[key].acl).toBe(ContentPermission.PRIVATE);
    });

    it('should set ACL to private for categoryless nonfixed key', async () => {
        const nonFixedKey = Object.values(CdnFixedKey).join('');
        const key = await createObject(nonFixedKey);

        expect(inMemoryCdn[key].acl).toBe(ContentPermission.PRIVATE);
    });

    it('should allow explicit setting of permission', async () => {
        const nonFixedKey = Object.values(CdnFixedKey).join('');
        const key = await cdn.putObject({
            key: nonFixedKey,
            body: `{"data": "${nonFixedKey}"}`,
            contentType: ContentType.JSON,
            permission: ContentPermission.PUBLIC
        });

        expect(inMemoryCdn[key].acl).toBe(ContentPermission.PUBLIC);
    });
})


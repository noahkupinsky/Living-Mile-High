import { CdnAdapter } from "~/@types";
import { inMemoryCDN } from "~/utils/createS3CdnService";
import { services } from "~/di";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
})


describe('S3Service', () => {
    it('should upload an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';

        await expect(cdn.putObject(key, body, contentType)).resolves.not.toThrow();
        expect(inMemoryCDN[key]).toEqual({ body, contentType });
    });

    it('should get an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';
        inMemoryCDN[key] = { body, contentType };

        const result = await cdn.getObject(key);
        expect(result.Body).toBe(body);
    });

    it('should move an object', async () => {
        const sourceKey = 'source-key';
        const destinationKey = 'destination-key';
        const body = 'test-body';
        const contentType = 'text/plain';
        inMemoryCDN[sourceKey] = { body, contentType };

        await expect(cdn.moveObject(sourceKey, destinationKey)).resolves.not.toThrow();
        expect(inMemoryCDN[destinationKey]).toEqual({ body, contentType });
        expect(inMemoryCDN[sourceKey]).toBeUndefined();
    });

    it('should delete an object', async () => {
        const key = 'test-key';
        const body = 'test-body';
        const contentType = 'text/plain';
        inMemoryCDN[key] = { body, contentType };

        await expect(cdn.deleteObject(key)).resolves.not.toThrow();
        expect(inMemoryCDN[key]).toBeUndefined();
    });

    it('should list all keys', async () => {
        inMemoryCDN['key1'] = { body: 'body1', contentType: 'text/plain' };
        inMemoryCDN['key2'] = { body: 'body2', contentType: 'text/plain' };

        const keys = await cdn.getAllKeys();
        expect(keys).toEqual(['key1', 'key2']);
    });
});
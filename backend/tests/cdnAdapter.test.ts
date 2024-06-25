import { CdnAdapter } from "../src/types";
import { inMemoryCDN } from "../src/utils/createS3CdnService";
import { services } from "../src/app";

let cdn: CdnAdapter;

beforeAll(() => {
    cdn = services().cdnAdapter;
})


describe('S3Service', () => {
    it('should get object URL correctly', () => {
        const objectKey = 'test-object';
        const url = cdn.getObjectUrl(objectKey);

        expect(url).toBe(`https://mock-bucket.s3.amazonaws.com/${objectKey}`);
    });

    it('should put object successfully', async () => {
        const objectKey = 'test-object';
        const body = 'test-body';
        const contentType = 'text/plain';

        const result = await cdn.putObject(objectKey, body, contentType);

        expect(result).toBe(true);
        expect(inMemoryCDN[objectKey]).toEqual({ body, contentType });
    });

    it('should delete object successfully', async () => {
        const objectKey = 'test-object';
        const body = 'test-body';
        const contentType = 'text/plain';

        // First, put the object
        await cdn.putObject(objectKey, body, contentType);

        // Then, delete the object
        const result = await cdn.deleteObject(objectKey);

        expect(result).toBe(true);
        expect(inMemoryCDN[objectKey]).toBeUndefined();
    });

    it('should get object body successfully', async () => {
        const objectKey = 'test-object';
        const body = 'test-body';
        const contentType = 'text/plain';

        // First, put the object
        await cdn.putObject(objectKey, body, contentType);

        const data = await cdn.getObject(objectKey);

        expect(data).toEqual({ Body: body });
    });
});
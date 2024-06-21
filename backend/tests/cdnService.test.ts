import { CdnService } from "../src/types";
import { inMemoryCDN } from "../src/services/createS3CdnService";
import { services } from "./setup";

let cdnService: CdnService;

beforeAll(() => {
    cdnService = services().cdnService
})


describe('S3Service', () => {
    it('should get object URL correctly', () => {
        const objectKey = 'test-object';
        const url = cdnService.getObjectUrl(objectKey);

        expect(url).toBe(`https://mock-bucket.s3.amazonaws.com/${objectKey}`);
    });

    it('should put object successfully', async () => {
        const objectKey = 'test-object';
        const body = 'test-body';
        const contentType = 'text/plain';

        const result = await cdnService.putObject(objectKey, body, contentType);

        expect(result).toBe(true);
        expect(inMemoryCDN[objectKey]).toEqual({ body, contentType });
    });

    it('should delete object successfully', async () => {
        const objectKey = 'test-object';
        const body = 'test-body';
        const contentType = 'text/plain';

        // First, put the object
        await cdnService.putObject(objectKey, body, contentType);

        // Then, delete the object
        const result = await cdnService.deleteObject(objectKey);

        expect(result).toBe(true);
        expect(inMemoryCDN[objectKey]).toBeUndefined();
    });

    it('should get object body successfully', async () => {
        const objectKey = 'test-object';
        const body = 'test-body';
        const contentType = 'text/plain';

        // First, put the object
        await cdnService.putObject(objectKey, body, contentType);

        const data = await cdnService.getObject(objectKey);

        expect(data).toEqual({ Body: body });
    });
});
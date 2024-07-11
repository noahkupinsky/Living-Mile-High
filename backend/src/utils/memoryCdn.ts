import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandOutput,
    GetObjectCommand,
    GetObjectCommandOutput,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    DeleteObjectsCommand,
    DeleteObjectsCommandOutput,
    DeleteObjectCommand,
    DeleteObjectCommandOutput
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // No more data
    return stream;
}

// In-memory storage
export const inMemoryCdn: { [key: string]: { body: Buffer; metadata: { [key: string]: string } } } = {};

export function mockS3Cdn() {
    const s3Mock = mockClient(S3Client);

    // Mock PutObjectCommand
    s3Mock.on(PutObjectCommand).callsFake((input) => {
        inMemoryCdn[input.Key] = {
            body: Buffer.from(input.Body as string),
            metadata: input.Metadata || {},
        };

        const result: PutObjectCommandOutput = {
            $metadata: {}
        }

        return Promise.resolve(result);
    });

    // Mock GetObjectCommand
    s3Mock.on(GetObjectCommand).callsFake((input) => {
        if (!inMemoryCdn[input.Key]) {
            throw new Error(`Object ${input.Key} does not exist`);
        }
        const object = inMemoryCdn[input.Key];

        const result: GetObjectCommandOutput = {
            Body: object.body as any,
            Metadata: object.metadata,
            $metadata: {}
        }

        return Promise.resolve(result);
    });

    // Mock ListObjectsV2Command
    s3Mock.on(ListObjectsV2Command).callsFake((input) => {
        const prefix = input.Prefix || '';
        const objects = Object.keys(inMemoryCdn)
            .filter((key) => key.startsWith(prefix))
            .map((key) => ({ Key: key }));

        const result: ListObjectsV2CommandOutput = {
            Contents: objects,
            IsTruncated: false,
            $metadata: {}
        };

        return Promise.resolve(result);
    });

    s3Mock.on(DeleteObjectCommand).callsFake((input) => {
        if (!inMemoryCdn[input.Key]) {
            throw new Error(`Object ${input.Key} does not exist`);
        }

        delete inMemoryCdn[input.Key];

        const result: DeleteObjectCommandOutput = {
            $metadata: {}
        };

        return Promise.resolve(result);
    });

    s3Mock.on(DeleteObjectsCommand).callsFake((input) => {
        input.Delete.Objects.forEach((obj: any) => {
            if (obj.Key) {
                delete inMemoryCdn[obj.Key];
            }
        });

        const result: DeleteObjectsCommandOutput = {
            Deleted: input.Delete.Objects.map((obj: any) => ({ Key: obj.Key })),
            $metadata: {}
        };

        return Promise.resolve(result);
    });
}
import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandOutput,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    DeleteObjectsCommand,
    DeleteObjectsCommandOutput,
    DeleteObjectCommand,
    DeleteObjectCommandOutput,
    GetObjectCommand,
    GetObjectCommandOutput
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { Readable } from "stream";

// In-memory storage
export const inMemoryCdn: { [key: string]: { body: any; contentType?: string; metadata: { [key: string]: string } } } = {};

export function mockS3Cdn() {
    const s3Mock = mockClient(S3Client);

    s3Mock.on(PutObjectCommand).callsFake((input) => {
        const body = input.Body;

        inMemoryCdn[input.Key] = {
            body,
            contentType: input.ContentType,
            metadata: input.Metadata || {},
        };

        const result: PutObjectCommandOutput = {
            $metadata: {}
        };

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

    s3Mock.on(GetObjectCommand).callsFake((input) => {
        const object = inMemoryCdn[input.Key];

        if (!object) {
            throw new Error(`Object ${input.Key} does not exist`);
        }

        const stream: any = new Readable();
        stream.push(object.body);
        stream.push(null);

        const result: GetObjectCommandOutput = {
            Body: stream,
            Metadata: object.metadata,
            ContentType: object.contentType,
            $metadata: {}
        };

        return Promise.resolve(result);
    });
}
import { S3Client, ListBucketsCommandOutput, ListBucketsCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import { Compose, config } from "../config";
import { dockerDown, dockerRemoveVolumes, dockerRun } from "./dockerUtils";
import { loadEnvFile } from "./envUtils";
import { upsertAdmin, withMongo } from "./admin";

export async function setupLocalServices() {
    dockerRemoveVolumes();
    await setupLocalServicesForCompose(config.composes.devServices);
    await setupLocalServicesForCompose(config.composes.stagingServices);
}

async function setupLocalServicesForCompose(compose: Compose) {
    dockerRun(compose);
    await createLocalBucket(compose, 9000);
    await withMongo(`mongodb://localhost:${27017}`, async () => {
        await upsertAdmin("admin", "password");
    })
    dockerDown(compose);
}

async function createLocalBucket(compose: Compose, port: number) {
    const { CDN_KEY, CDN_SECRET, CDN_BUCKET } = loadEnvFile(compose.envFile);

    try {
        const client = new S3Client({
            endpoint: `http://localhost:${port}`,
            region: 'sfo3',
            credentials: {
                accessKeyId: CDN_KEY,
                secretAccessKey: CDN_SECRET,
            },
            forcePathStyle: true,
        });

        const buckets: ListBucketsCommandOutput = await client.send(new ListBucketsCommand({}));
        const bucketExists = buckets.Buckets?.some(bucket => bucket.Name === CDN_BUCKET);

        if (!bucketExists) {
            const createBucketParams = { Bucket: CDN_BUCKET };
            await client.send(new CreateBucketCommand(createBucketParams));
            console.log(`Bucket created: ${CDN_BUCKET}`);
        } else {
            console.log(`Bucket already exists: ${CDN_BUCKET}`);
        }

        // Define public policy
        const publicPolicy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: "*",
                    Action: [
                        "s3:GetBucketLocation",
                        "s3:ListBucket"
                    ],
                    Resource: `arn:aws:s3:::${CDN_BUCKET}`
                },
                {
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: `arn:aws:s3:::${CDN_BUCKET}/*`
                }
            ]
        };

        // Apply the bucket policy
        const policyParams = {
            Bucket: CDN_BUCKET,
            Policy: JSON.stringify(publicPolicy)
        };

        await client.send(new PutBucketPolicyCommand(policyParams));
        console.log(`Public policy set for bucket: ${CDN_BUCKET}`);
    } catch (err: any) {
        if (err.code !== 'BucketAlreadyOwnedByYou') {
            console.error('Error:', err);
        }

    }
}
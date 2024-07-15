import { S3Client, ListBucketsCommandOutput, ListBucketsCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import path from "path";
import { Compose, config } from "../config";
import { dockerDown, dockerRemoveVolumes, dockerRun } from "./dockerUtils";
import fs from "fs";
import mongoose, { model } from 'mongoose';
import { AdminSchema, hashPassword } from "living-mile-high-lib";
import { loadEnvFile } from "./envUtils";

const AdminModel = model('Admin', AdminSchema);

export async function setupLocalServices() {
    createDataDir();
    dockerRemoveVolumes();
    await setupLocalServicesForCompose(config.composes.devServices);
    await setupLocalServicesForCompose(config.composes.stagingServices);
}

async function setupLocalServicesForCompose(compose: Compose) {
    dockerRun(compose);
    await createLocalBucket(compose, 9000);
    await createLocalAdmin(27017);
    dockerDown(compose);
}

function createDataDir() {
    if (fs.existsSync(path.resolve(process.cwd(), '.data'))) {
        throw new Error('Data directory already exists. Please remove it before running this command.');
    }

    const data_services = ['mongo', 'minio'];
    const data_categories = ['development', 'production', 'staging'];

    const data_dirs = data_services.map(s => data_categories.map(c => `.data/${s}/${c}`)).flat();

    data_dirs.forEach(dir => fs.mkdirSync(path.resolve(process.cwd(), dir), { recursive: true }));
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

async function createLocalAdmin(port: number) {
    const uri = `mongodb://localhost:${port}`;
    await mongoose.connect(uri, {});

    try {
        const hashedPassword = await hashPassword('password');
        const newAdmin = new AdminModel({ username: 'admin', password: hashedPassword });
        await newAdmin.save();
        console.log('Admin added to MongoDB.');
    } finally {
        await mongoose.disconnect();
    }
}
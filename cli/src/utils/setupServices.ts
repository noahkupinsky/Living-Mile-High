import { S3Client, ListBucketsCommandOutput, ListBucketsCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import path from "path";
import { config } from "../config";
import { dockerDown, dockerRemoveVolumes, dockerRun } from "./dockerUtils";
import fs from "fs";
import bcrypt from "bcrypt";
import mongoose, { Schema, model, Document } from 'mongoose';
import { AdminSchema } from "living-mile-high-lib";

export async function setupLocalServices() {
    createDataDir();
    dockerRemoveVolumes();
    await setupServicesForComposeFile(config.composeDevServicesFile);
    await setupServicesForComposeFile(config.composeStagingServicesFile);
}

async function setupServicesForComposeFile(composeFile: string) {
    dockerRun(composeFile);
    await createBucket(9000);
    await createDefaultAdmin(27017);
    dockerDown(composeFile);
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

async function createBucket(port: number) {
    try {
        const client = new S3Client({
            endpoint: `http://localhost:${port}`,
            region: 'sfo3',
            credentials: {
                accessKeyId: process.env.MINIO as string,
                secretAccessKey: process.env.MINIO as string,
            },
            forcePathStyle: true,
        });

        const buckets: ListBucketsCommandOutput = await client.send(new ListBucketsCommand({}));
        const bucketExists = buckets.Buckets?.some(bucket => bucket.Name === process.env.MINIO);

        if (!bucketExists) {
            const createBucketParams = { Bucket: process.env.MINIO as string };
            await client.send(new CreateBucketCommand(createBucketParams));
            console.log(`Bucket created: ${process.env.MINIO}`);
        } else {
            console.log(`Bucket already exists: ${process.env.MINIO}`);
        }
    } catch (err: any) {
        if (err.code !== 'BucketAlreadyOwnedByYou') {
            console.error('Error:', err);
        }

    }
}

const AdminModel = model('Admin', AdminSchema);

async function createDefaultAdmin(port: number) {
    const uri = `mongodb://localhost:${port}/?authSource=admin`; // Replace 'yourDatabase' with the correct database name
    await mongoose.connect(uri, {});

    try {
        const hashedPassword = await bcrypt.hash('password', 10);
        const newAdmin = new AdminModel({ username: 'admin', password: hashedPassword });
        await newAdmin.save();
        console.log('Admin document added to MongoDB.');
    } finally {
        await mongoose.disconnect();
    }
}
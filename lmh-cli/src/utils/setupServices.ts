import { S3Client, ListBucketsCommandOutput, ListBucketsCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import path from "path";
import { Compose, config } from "../config";
import { dockerDown, dockerRemoveVolumes, dockerRun } from "./dockerUtils";
import fs from "fs";
import mongoose, { model } from 'mongoose';
import { AdminSchema, createUploadAssetRequest, hashPassword, House, LoginRequest, UploadAssetResponse, UpsertHouseRequest } from "living-mile-high-lib";
import { loadEnvFile, joinRoot } from "./envUtils";
import axios, { AxiosInstance } from "axios";
import { CookieJar } from 'tough-cookie';
import { HttpsCookieAgent } from 'http-cookie-agent/http';

const AdminModel = model('Admin', AdminSchema);
type RequiredHouse = Omit<House, 'neighborhood' | 'createdAt' | 'updatedAt' | 'id' | 'stats' | 'images'> & Partial<House>;

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
    if (fs.existsSync(joinRoot('.data'))) {
        throw new Error('Data directory already exists. Please remove it before running this command.');
    }

    const data_services = ['mongo', 'minio'];
    const data_categories = ['development', 'production', 'staging'];

    const data_dirs = data_services.map(s => data_categories.map(c => `.data/${s}/${c}`)).flat();

    data_dirs.forEach(dir => fs.mkdirSync(joinRoot(dir), { recursive: true }));
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

export async function massUploadHouses(env: string, username: string, password: string, folder: string) {
    const env_path = joinRoot(`.env.${env}`);

    if (!fs.existsSync(env_path)) {
        throw new Error(`Environment file not found: ${env_path}`);
    }

    const { NEXT_PUBLIC_BACKEND_URL } = loadEnvFile(env_path);

    const jar = new CookieJar();

    const httpsAgent = new HttpsCookieAgent({
        cookies: { jar },
        rejectUnauthorized: false, // Ignore SSL certificate errors for development
    });

    // Configure Axios to use the custom HTTPS agent and the cookie jar
    const api = axios.create({
        baseURL: `${NEXT_PUBLIC_BACKEND_URL}/api`,
        withCredentials: true,
        httpsAgent: httpsAgent,
    });

    try {
        const req: LoginRequest = { username, password };
        await api.post('auth/login', req);
    } catch (err: any) {
        throw new Error(`Failed to login: ${err.message}`);
    }

    // look for json file in data folder
    const json_files = fs.readdirSync(folder).filter(file => path.extname(file) === '.json');
    if (json_files.length !== 1) {
        throw new Error(`Expected 1 json file in ${folder}, found ${json_files.length}`);
    }
    const json = fs.readFileSync(path.resolve(folder, json_files[0]), 'utf8');

    const localHouses: RequiredHouse[] = JSON.parse(json);

    const houses = await Promise.all(localHouses.map((house: RequiredHouse) => resolveLocalHouseImages(api, folder, house)));

    await Promise.all(houses.map(house => insertHouse(api, house)));
}

function isLink(link: string): boolean {
    return link.startsWith('http://') || link.startsWith('https://');
}

async function uploadAsset(api: AxiosInstance, folder: string, asset: string): Promise<string> {
    if (isLink(asset)) {
        return asset;
    }

    const file_path = path.resolve(folder, asset);
    const formData = createUploadAssetRequest(fs.createReadStream(file_path));

    try {
        const response = await api.post('asset/upload', formData, {
            headers: {
                ...formData.getHeaders(),
            }
        });
        const resBody: UploadAssetResponse = response.data;

        if (response.status === 200) {
            return resBody.url!;
        } else {
            throw new Error('Failed to upload asset');
        }
    } catch (err: any) {
        throw new Error(`Failed to upload asset, error: ${err.message}`);
    }
}

async function resolveLocalHouseImages(api: AxiosInstance, folder: string, house: RequiredHouse): Promise<RequiredHouse> {
    const mainImage = await uploadAsset(api, folder, house.mainImage);
    const images = !house.images ? [] : await Promise.all(house.images.map((image: string) => uploadAsset(api, folder, image)));

    return { ...house, mainImage, images };
}

async function insertHouse(api: AxiosInstance, house: RequiredHouse): Promise<void> {
    try {
        const req: UpsertHouseRequest = { house };

        await api.post('house/upsert', req);
    } catch (err: any) {
        throw new Error(`Failed to insert house`);
    }
}
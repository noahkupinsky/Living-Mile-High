import { S3Client, ListBucketsCommandOutput, ListBucketsCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import path from "path";
import { Compose, config } from "../config";
import { dockerDown, dockerRemoveVolumes, dockerRun } from "./dockerUtils";
import fs from "fs";
import mongoose, { model } from 'mongoose';
import { AdminSchema, createUploadAssetRequest, hashPassword, House, LoginRequest, LoginResponse, UploadAssetResponse, UpsertHouseRequest } from "living-mile-high-lib";
import { loadEnvFile, joinRoot } from "./envUtils";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Agent } from "https";

const AdminModel = model('Admin', AdminSchema);
type RequiredHouse = Omit<House, 'neighborhood' | 'createdAt' | 'updatedAt' | 'id' | 'stats' | 'images'> & Partial<House>;

const UPLOAD_BATCH_SIZE = 5;

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
    if (fs.existsSync(joinRoot('.local'))) {
        throw new Error('Local data directory already exists. Please remove it before running this command.');
    }

    const data_services = ['mongo', 'minio'];
    const data_categories = ['development', 'production', 'staging'];

    const data_dirs = data_services.map(s => data_categories.map(c => `.local/${s}/${c}`)).flat();

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

type PostFn = (url: string, data: any, config?: AxiosRequestConfig) => Promise<any>;

export async function massUploadHouses(env: string, username: string, password: string, folder: string) {
    const env_path = joinRoot(`.env.${env}`);

    if (!fs.existsSync(env_path)) {
        throw new Error(`Environment file not found: ${env_path}`);
    }

    const { NEXT_PUBLIC_BACKEND_URL } = loadEnvFile(env_path);

    // Configure Axios to use the custom HTTPS agent and the cookie jar
    const api = axios.create({
        baseURL: `${NEXT_PUBLIC_BACKEND_URL}/api`,
        withCredentials: true,
        httpsAgent: new Agent({
            rejectUnauthorized: false,
        }),
    });

    let token: string;

    try {
        const req: LoginRequest = { username, password };
        const loginResponse = await api.post('auth/login', req);
        console.log('Login successful:', loginResponse.status);
        console.log('Login response headers:', loginResponse.headers);

        // Extract token from the response headers
        const setCookieHeader = loginResponse.headers['set-cookie'];
        if (setCookieHeader && setCookieHeader.length > 0) {
            const cookie = setCookieHeader[0];
            const tokenMatch = cookie.match(/token=([^;]+)/);
            if (tokenMatch) {
                token = tokenMatch[1];
                console.log('Token extracted:', token);
            } else {
                throw new Error('Token not found in Set-Cookie header');
            }
        } else {
            throw new Error('Set-Cookie header not found in login response');
        }
    } catch (err: any) {
        throw new Error(`Failed to login: ${err.message}`);
    }

    // Custom post method with token attached as a Cookie header
    const postFn: PostFn = (url: string, data?: any, config?: AxiosRequestConfig) => {
        return api.post(url, data, {
            ...config,
            headers: {
                ...config?.headers,
                'Cookie': `token=${token}`,
            },
        });
    };

    // look for json file in data folder
    const json_files = fs.readdirSync(folder).filter(file => path.extname(file) === '.json');
    if (json_files.length !== 1) {
        throw new Error(`Expected 1 json file in ${folder}, found ${json_files.length}`);
    }
    const json = fs.readFileSync(path.resolve(folder, json_files[0]), 'utf8');

    const houses: RequiredHouse[] = JSON.parse(json);

    const numBatches = Math.ceil(houses.length / UPLOAD_BATCH_SIZE);

    for (let i = 0; i < 1; i++) {
        const start = i * UPLOAD_BATCH_SIZE;
        const end = Math.min(start + UPLOAD_BATCH_SIZE, houses.length);
        const batch = houses.slice(start, end);
        await Promise.all(batch.map(house => insertHouse(postFn, folder, house)));
        console.log(`Uploaded batch ${i + 1} of ${numBatches}`);
    }
}

function isLink(link: string): boolean {
    return link.startsWith('http://') || link.startsWith('https://');
}

async function uploadAsset(postFn: PostFn, folder: string, asset: string): Promise<string> {
    if (isLink(asset)) {
        return asset;
    }

    const file_path = path.resolve(folder, asset);
    const formData = createUploadAssetRequest(fs.createReadStream(file_path));

    try {
        const response = await postFn('asset/upload', formData, {
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

async function resolveLocalHouseImages(postFn: PostFn, folder: string, house: RequiredHouse): Promise<RequiredHouse> {
    const mainImage = await uploadAsset(postFn, folder, house.mainImage);
    const images = !house.images ? [] : await Promise.all(house.images.map((image: string) => uploadAsset(postFn, folder, image)));

    return { ...house, mainImage, images };
}

async function insertHouse(postFn: PostFn, folder: string, unresolvedHouse: RequiredHouse): Promise<void> {
    try {
        const house = await resolveLocalHouseImages(postFn, folder, unresolvedHouse);

        const req: UpsertHouseRequest = { house };

        await postFn('house/upsert', req);
    } catch (err: any) {
        console.error(`Failed to insert house: ${err.message}`);
    }
}
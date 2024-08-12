import path from "path";
import { joinEnv } from "../config";
import fs from "fs";
import { House, LoginRequest, UploadAssetResponse, UpsertHouseRequest } from "living-mile-high-lib";
import { loadEnvFile } from "./envUtils";
import axios, { AxiosRequestConfig } from "axios";
import { Agent } from "https";
import FormData from "form-data";

const UPLOAD_BATCH_SIZE = 5;
type RequiredHouse = Omit<House, 'neighborhood' | 'createdAt' | 'updatedAt' | 'id' | 'stats' | 'images'> & Partial<House>;


type PostFn = (url: string, data: any, config?: AxiosRequestConfig) => Promise<any>;

export async function massUploadHouses(env: string, username: string, password: string, folder: string) {
    const env_path = joinEnv(env);

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

        // Extract token from the response headers
        const setCookieHeader = loginResponse.headers['set-cookie'];
        if (setCookieHeader && setCookieHeader.length > 0) {
            const cookie = setCookieHeader[0];
            const tokenMatch = cookie.match(/token=([^;]+)/);
            if (tokenMatch) {
                token = tokenMatch[1];
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

    for (let i = 0; i < numBatches; i++) {
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
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file_path));
    const headers = {
        'Content-Type': 'multipart/form-data',
    };

    try {
        const response = await postFn('asset/upload', formData, {
            headers: {
                ...headers,
            },
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
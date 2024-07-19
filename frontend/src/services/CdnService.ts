'use client';

import axios, { AxiosInstance } from 'axios';
import { CdnFixedKey } from 'living-mile-high-lib';
import { env } from 'next-runtime-env';

const cdnUrl = () => env('NEXT_PUBLIC_CDN_URL')!;

export class CdnService {
    private cdn: AxiosInstance;

    constructor() {
        this.cdn = axios.create({
            baseURL: cdnUrl(),
        });
    }

    defaultHomePageImages(): string[] {
        return [`${cdnUrl()}/${CdnFixedKey.HOME_PAGE_FIRST}`];
    }

    async fetchSiteData() {
        try {
            const response = await this.cdn.get(CdnFixedKey.SITE_DATA);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch site data:', error);
            throw error;
        }
    }
}
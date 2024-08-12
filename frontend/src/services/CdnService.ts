'use client';

import { CdnFixedKey, SiteData } from 'living-mile-high-lib';
import { env } from 'next-runtime-env';

const cdnUrl = () => env('NEXT_PUBLIC_CDN_URL')!;

export class CdnService {
    defaultHomePageImages(): string[] {
        return [`${cdnUrl()}/${CdnFixedKey.HOME_PAGE_FIRST}`];
    }

    async fetchSiteData(): Promise<SiteData> {
        try {
            const siteDataUrl = `${cdnUrl()}/${CdnFixedKey.SITE_DATA}`;

            const response = await fetch(siteDataUrl, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch site data`);
            }

            const data = await response.json();

            return data;
        } catch (error: any) {
            console.error('Failed to fetch site data:', error?.response?.data?.message);
            throw error;
        }
    }
}
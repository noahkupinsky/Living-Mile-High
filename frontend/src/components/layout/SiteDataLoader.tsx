'use client';

import React from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import Loader from './Loader';

type SiteDataLoaderProps = {
    children: React.ReactNode;
}

const SiteDataLoader = ({ children }: SiteDataLoaderProps) => {
    const { isLoading } = useSiteData();

    return (
        <Loader isLoading={isLoading}>
            {children}
        </Loader>
    )
}

export default SiteDataLoader;
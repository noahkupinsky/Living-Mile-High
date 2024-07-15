"use client";

import React from 'react';
import { HouseProvider } from './HouseContext';
import { useSiteData } from '@/contexts/SiteDataContext';


export type HouseQueryContextProps = {
    children: React.ReactNode;
}

const HouseQueryContext = ({ children }: HouseQueryContextProps) => {
    const { queryHouses, isLoading } = useSiteData();
    const houses = isLoading ? [] : queryHouses({});

    return (
        <HouseProvider value={{ houses }}>
            {children}
        </HouseProvider>
    );
};

export default HouseQueryContext;
"use client";
import React, { useState } from 'react';
import { HouseProvider } from './HouseContext';
import useFetchData from '@/services/fetchService';
import { HouseQuery } from 'living-mile-high-types';
import { useEnv } from '@/providers/EnvProvider';


export type HouseQueryContextProps = {
    children: React.ReactNode;
    initialQuery: HouseQuery;
}

const HouseQueryContext = ({ children, initialQuery }: HouseQueryContextProps) => {
    const env = useEnv();
    const apiUrl = env.API_URL!;
    const [query, setQuery] = useState(initialQuery);
    const { data, error, isLoading } = useFetchData('/api/houses', apiUrl, query);
    const houses = isLoading ? [] : data;

    return (
        <HouseProvider value={{ houses, setQuery }}>
            {children}
        </HouseProvider>
    );
};

export default HouseQueryContext;
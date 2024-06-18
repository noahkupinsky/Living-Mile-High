"use client";
import React, { useState } from 'react';
import { HouseProvider } from './HouseContext';
import useFetchData from '@/services/fetchService';
import { HouseQuery } from 'living-mile-high-types';
import { env } from 'next-runtime-env';


export type HouseQueryContextProps = {
    children: React.ReactNode;
    initialQuery: HouseQuery;
}

const HouseQueryContext = ({ children, initialQuery }: HouseQueryContextProps) => {
    const apiUrl = env('NEXT_PUBLIC_API_URL')!;
    console.log(apiUrl);
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
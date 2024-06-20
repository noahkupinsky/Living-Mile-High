"use client";

import React, { useState } from 'react';
import { HouseProvider } from './HouseContext';
import { HouseQuery } from 'living-mile-high-types';
import { useFetch, useServices } from '@/providers/ServiceProvider';


export type HouseQueryContextProps = {
    children: React.ReactNode;
    initialQuery: HouseQuery;
}

const HouseQueryContext = ({ children, initialQuery }: HouseQueryContextProps) => {
    const { apiService } = useServices();
    const [query, setQuery] = useState(initialQuery);
    const { data, error, isLoading } = useFetch('/houses', apiService, query);
    const houses = isLoading ? [] : data;

    return (
        <HouseProvider value={{ houses, setQuery }}>
            {children}
        </HouseProvider>
    );
};

export default HouseQueryContext;
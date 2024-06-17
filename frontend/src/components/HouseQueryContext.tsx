import React, { useState } from 'react';
import { HouseProvider } from './HouseContext';
import useFetchData from '@/services/fetchService';
import { HouseQuery } from 'living-mile-high-types';

export type HouseQueryContextProps = {
    children: React.ReactNode;
    initialQuery: HouseQuery;
}

const HouseQueryContext = ({ children, initialQuery }: HouseQueryContextProps) => {
    const [query, setQuery] = useState(initialQuery);
    const { data, error, isLoading } = useFetchData('/api/houses', query);
    const houses = isLoading ? [] : data;

    return (
        <HouseProvider value={{ houses, setQuery }}>
            {children}
        </HouseProvider>
    );
};

export default HouseQueryContext;
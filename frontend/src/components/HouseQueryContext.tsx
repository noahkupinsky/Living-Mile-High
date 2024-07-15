"use client";

import React from 'react';
import { HouseProvider } from './HouseContext';
import { useFetch, useServices } from '@/providers/ServiceProvider';


export type HouseQueryContextProps = {
    children: React.ReactNode;
}

const HouseQueryContext = ({ children }: HouseQueryContextProps) => {
    const { apiService } = useServices();
    const { data, error, isLoading } = useFetch('/house', apiService, {});
    const houses = isLoading ? [] : data;

    return (
        <HouseProvider value={{ houses }}>
            {children}
        </HouseProvider>
    );
};

export default HouseQueryContext;
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextTamaguiProvider } from './NextTamaguiProvider';
import { ServiceProvider } from './ServiceProvider';

const queryClient = new QueryClient();

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <NextTamaguiProvider>
                <ServiceProvider>
                    {children}
                </ServiceProvider>
            </NextTamaguiProvider>
        </QueryClientProvider>

    );
};

export default Providers;
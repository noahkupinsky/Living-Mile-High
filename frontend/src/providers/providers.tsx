'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextTamaguiProvider } from './NextTamaguiProvider';

const queryClient = new QueryClient();

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <NextTamaguiProvider>
                {children}
            </NextTamaguiProvider>
        </QueryClientProvider>
    );
};

export default Providers;
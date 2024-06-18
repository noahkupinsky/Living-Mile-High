'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { EnvProvider } from './EnvProvider';
import { NextTamaguiProvider } from './NextTamaguiProvider';

const queryClient = new QueryClient();

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <EnvProvider >
            <QueryClientProvider client={queryClient}>
                <NextTamaguiProvider>
                    {children}
                </NextTamaguiProvider>
            </QueryClientProvider>
        </EnvProvider>
    );
};

export default Providers;
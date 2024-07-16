'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextTamaguiProvider } from './NextTamaguiProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';

const queryClient = new QueryClient();

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <NextTamaguiProvider>
                <AuthProvider>
                    <SiteDataProvider>
                        {children}
                    </SiteDataProvider>
                </AuthProvider>
            </NextTamaguiProvider>
        </QueryClientProvider>

    );
};

export default Providers;
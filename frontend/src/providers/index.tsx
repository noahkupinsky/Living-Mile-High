'use client';

import React from 'react';
import { NextTamaguiProvider } from './NextTamaguiProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';
import { SizingProvider } from '@/contexts/SizingContext';

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <NextTamaguiProvider>
            <AuthProvider>
                <SiteDataProvider>
                    <SizingProvider>
                        {children}
                    </SizingProvider>
                </SiteDataProvider>
            </AuthProvider>
        </NextTamaguiProvider >
    );
};

export default Providers;
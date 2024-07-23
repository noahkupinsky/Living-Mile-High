'use client';

import React from 'react';
import { NextTamaguiProvider } from './NextTamaguiProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <NextTamaguiProvider>
            <AuthProvider>
                <SiteDataProvider>
                    {children}
                </SiteDataProvider>
            </AuthProvider>
        </NextTamaguiProvider>
    );
};

export default Providers;
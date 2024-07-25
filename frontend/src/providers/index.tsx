'use client';

import React from 'react';
import { NextTamaguiProvider } from './NextTamaguiProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';
import { ResizeProvider } from '@/contexts/ResizeContext';

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <NextTamaguiProvider>
            <ResizeProvider>
                <AuthProvider>
                    <SiteDataProvider>
                        {children}
                    </SiteDataProvider>
                </AuthProvider>
            </ResizeProvider>
        </NextTamaguiProvider >
    );
};

export default Providers;
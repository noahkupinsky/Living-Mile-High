'use client';

import React from 'react';
import { NextTamaguiProvider } from './NextTamaguiProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';
import { SizingProvider } from '@/contexts/SizingContext';
import { CarouselProvider } from '@/contexts/CarouselContext';

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <NextTamaguiProvider>
            <AuthProvider>
                <SiteDataProvider>
                    <SizingProvider>
                        <CarouselProvider>
                            {children}
                        </CarouselProvider>
                    </SizingProvider>
                </SiteDataProvider>
            </AuthProvider>
        </NextTamaguiProvider >
    );
};

export default Providers;
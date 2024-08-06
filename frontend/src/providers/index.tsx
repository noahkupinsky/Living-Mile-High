'use client';

import React from 'react';
import { NextTamaguiProvider } from './NextTamaguiProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';
import { SizingProvider } from '@/contexts/SizingContext';
import { CarouselProvider } from '@/contexts/CarouselContext';
import { GoogleProvider } from '@/contexts/GoogleContext';
import { AlertProvider } from '@/contexts/AlertContext';
import { ServiceProvider } from '@/contexts/ServiceContext';

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <NextTamaguiProvider>
            <ServiceProvider>
                <AuthProvider>
                    <GoogleProvider>
                        <SiteDataProvider>
                            <SizingProvider>
                                <AlertProvider>
                                    <CarouselProvider>
                                        {children}
                                    </CarouselProvider>
                                </AlertProvider>
                            </SizingProvider>
                        </SiteDataProvider>
                    </GoogleProvider>
                </AuthProvider>
            </ServiceProvider>
        </NextTamaguiProvider >
    );
};

export default Providers;
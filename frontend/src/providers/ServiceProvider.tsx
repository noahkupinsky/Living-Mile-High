"use client"

import { ApiService, Services } from '../types';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { env } from 'next-runtime-env';
import AxiosApiService from '@/services/AxiosApiService';
import mockServices from '@/services/mockServices';
import { useQuery } from 'react-query';

const ServiceContext = createContext<Services | null>(null);

interface ServiceProviderProps {
    children: ReactNode;
}

const connectServices = () => {
    const apiUrl = env("NEXT_PUBLIC_API_URL")!;
    return {
        apiService: new AxiosApiService(apiUrl)
    };
}

const initServices = () => {
    const mockServicesEnv = (env('NEXT_PUBLIC_SERVICES') === 'mock');
    const services = mockServicesEnv ? mockServices() : connectServices();
    return services;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
    const [services,] = useState<Services>(initServices());

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = (): Services => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
};

export function useFetch(route: string, apiService: ApiService, params: any = {}) {
    const queryKey = [route, params];
    return useQuery(queryKey, () => apiService.fetch(route, params));
}
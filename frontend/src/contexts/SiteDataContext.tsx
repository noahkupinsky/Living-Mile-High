'use client'

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { EventMessage, GeneralData, House, SiteData } from 'living-mile-high-lib';
import services from '@/di';

type SiteDataContextType = {
    isLoading: boolean;
    houses: House[];
    generalData: GeneralData | undefined;
    version: number;
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

type SiteDataProviderProps = {
    children: React.ReactNode;
};

export const SiteDataProvider = ({ children }: SiteDataProviderProps) => {
    const [siteData, setSiteData] = useState<SiteData>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [version, setVersion] = useState<number>(0);
    const [generalData, setGeneralData] = useState<GeneralData | undefined>(undefined);
    const [houses, setHouses] = useState<House[]>([]);
    const { eventService, cdnService } = services();

    const fetchSiteData = useCallback(async () => {
        try {
            const data = await cdnService.fetchSiteData();
            const { houses: newHouses, ...newGeneralData } = data;
            setSiteData(data);
            setGeneralData(newGeneralData);
            setHouses(newHouses);
            setVersion(prevVersion => prevVersion + 1);
        } catch (error) {
            console.error('Failed to fetch site data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [cdnService]);

    useEffect(() => {
        const handleEvent = (data: any) => {
            if (data.message === EventMessage.SITE_UPDATED) {
                fetchSiteData();
            }
        };

        fetchSiteData();

        eventService.addEventHandler(handleEvent);

        return () => {
            eventService.removeEventHandler(handleEvent);
        };
    }, [fetchSiteData, eventService]);

    return (
        <SiteDataContext.Provider value={{ generalData, houses, isLoading, version }}>
            {children}
        </SiteDataContext.Provider>
    );
};

export const useSiteData = (): SiteDataContextType => {
    const context = useContext(SiteDataContext);
    if (context === undefined) {
        throw new Error('useSiteData must be used within an SiteDataProvider');
    }
    return context;
};
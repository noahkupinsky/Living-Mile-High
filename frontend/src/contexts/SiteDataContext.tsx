import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import BackendProvider from '@/providers/BackendProvider';
import { EventMessage, SiteData } from 'living-mile-high-lib';

type SiteDataContextType = {
    siteData: SiteData | undefined;
    isLoading: boolean;
    queryHouses: (filter: any) => void;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

type SiteDataProviderProps = {
    children: React.ReactNode;
}

export const SiteDataProvider = ({ children }: SiteDataProviderProps) => {
    const [siteData, setSiteData] = useState<SiteData>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchSiteData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await BackendProvider.fetchSiteData();
            setSiteData(data);
        } catch (error) {
            console.error('Failed to fetch site data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleEvent = (data: string) => {
            if (data === EventMessage.SITE_UPDATED) {
                fetchSiteData();
            }
        };

        BackendProvider.addEventHandler(handleEvent);

        fetchSiteData();

        return () => {
            BackendProvider.removeEventHandler(handleEvent);
        };
    }, [fetchSiteData]);

    const queryHouses = useCallback((filter: any) => {
        if (!siteData) return [];

        return siteData.houses;
    }, [siteData]);

    return (
        <SiteDataContext.Provider value={{ siteData, queryHouses, isLoading }}>
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
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { EventMessage, GeneralData, SiteData } from 'living-mile-high-lib';
import services from '@/di';

type SiteDataContextType = {
    isLoading: boolean;
    queryHouses: (filter: any) => void;
    getGeneralData: () => GeneralData | undefined;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

type SiteDataProviderProps = {
    children: React.ReactNode;
}

export const SiteDataProvider = ({ children }: SiteDataProviderProps) => {
    const [siteData, setSiteData] = useState<SiteData>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { sseService, cdnService } = services();

    const fetchSiteData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await cdnService.fetchSiteData();
            setSiteData(data);
        } catch (error) {
            console.error('Failed to fetch site data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [cdnService]);

    useEffect(() => {
        const handleEvent = (data: string) => {
            if (data === EventMessage.SITE_UPDATED) {
                fetchSiteData();
            }
        };

        sseService.addEventHandler(handleEvent);

        fetchSiteData();

        return () => {
            sseService.removeEventHandler(handleEvent);
        };
    }, [fetchSiteData, sseService]);

    const queryHouses = useCallback((filter: any) => {
        if (!siteData) return [];

        return siteData.houses;
    }, [siteData]);

    const getGeneralData = useCallback((): GeneralData | undefined => {
        if (!siteData) return undefined;

        const { houses: _, ...generalData } = siteData;
        return generalData;
    }, [siteData]);

    return (
        <SiteDataContext.Provider value={{ getGeneralData, queryHouses, isLoading }}>
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
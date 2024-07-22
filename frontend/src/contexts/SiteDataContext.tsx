'use client'

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { GeneralData, House, SiteData } from 'living-mile-high-lib';
import services from '@/di';

type SiteDataContextType = {
    isLoading: boolean;
    houses: House[];
    generalData: GeneralData | undefined;
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

type SiteDataProviderProps = {
    children: React.ReactNode;
};

export const SiteDataProvider = ({ children }: SiteDataProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [generalData, setGeneralData] = useState<GeneralData | undefined>(undefined);
    const [houses, setHouses] = useState<House[]>([]);
    const { updateService, cdnService } = services();

    const fetchSiteData = useCallback(async () => {
        try {
            const data: SiteData = await cdnService.fetchSiteData();
            const { houses: newHouses, ...newGeneralData } = data;
            setGeneralData(newGeneralData);
            setHouses(newHouses);
            return data;
        } catch (error) {
            console.error('Failed to fetch site data:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [cdnService]);

    useEffect(() => {
        const siteUpdater = async () => {
            return await fetchSiteData();
        };

        fetchSiteData();

        updateService.setSiteUpdater(siteUpdater);

        return () => {
            updateService.unsetSiteUpdater();
        };
    }, [fetchSiteData, updateService]);

    return (
        <SiteDataContext.Provider value={{
            generalData,
            houses,
            isLoading,
        }}>
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
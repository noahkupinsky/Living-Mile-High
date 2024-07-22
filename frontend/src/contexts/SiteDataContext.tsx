'use client'

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { EventMessage, GeneralData, House, SiteData } from 'living-mile-high-lib';
import services from '@/di';
import { SiteEventHandler, SiteUpdateHandler } from '@/types';

type SiteDataContextType = {
    isLoading: boolean;
    houses: House[];
    generalData: GeneralData | undefined;
    addUpdateHandler: (handler: SiteUpdateHandler) => void;
    removeUpdateHandler: (handler: SiteUpdateHandler) => void;
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

type SiteDataProviderProps = {
    children: React.ReactNode;
};

export const SiteDataProvider = ({ children }: SiteDataProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [generalData, setGeneralData] = useState<GeneralData | undefined>(undefined);
    const [houses, setHouses] = useState<House[]>([]);
    const { eventService, cdnService } = services();
    const [updateHandlers, setUpdateHandlers] = useState<SiteUpdateHandler[]>([]);

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
        const siteUpdater: SiteEventHandler = async (event, isLocal) => {
            if (event.messages.includes(EventMessage.SITE_UPDATED)) {
                const newData = await fetchSiteData();
                updateHandlers.forEach(handler => handler(isLocal, newData));
            }
        };

        fetchSiteData();

        eventService.addEventHandler(siteUpdater);

        return () => {
            eventService.removeEventHandler(siteUpdater);
        };
    }, [fetchSiteData, eventService, updateHandlers]);

    const addUpdateHandler = (handler: SiteUpdateHandler) => {
        setUpdateHandlers([...updateHandlers, handler]);
    };

    const removeUpdateHandler = (handler: SiteUpdateHandler) => {
        setUpdateHandlers(updateHandlers.filter(h => h !== handler));
    };

    return (
        <SiteDataContext.Provider value={{
            generalData,
            houses,
            isLoading,
            addUpdateHandler,
            removeUpdateHandler
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
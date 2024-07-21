'use client'

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { DeepPartial, EventMessage, GeneralData, generateEventId, House, SiteData } from 'living-mile-high-lib';
import services from '@/di';

type SiteDataContextType = {
    isLoading: boolean;
    houses: House[];
    generalData: GeneralData | undefined;
    version: number;
    updateGeneralData: (data: DeepPartial<GeneralData>) => Promise<void>
    upsertHouse: (house: DeepPartial<House>) => Promise<string>
    deleteHouse: (id: string) => Promise<void>
    restoreBackup: (key: string) => Promise<void>

};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

type SiteDataProviderProps = {
    children: React.ReactNode;
};

export const SiteDataProvider = ({ children }: SiteDataProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [version, setVersion] = useState<number>(0);
    const [generalData, setGeneralData] = useState<GeneralData | undefined>(undefined);
    const [houses, setHouses] = useState<House[]>([]);
    const { eventService, cdnService, apiService } = services();

    const fetchSiteData = useCallback(async () => {
        try {
            const data: SiteData = await cdnService.fetchSiteData();
            const { houses: newHouses, ...newGeneralData } = data;
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

    const updateGeneralData = async (data: DeepPartial<GeneralData>): Promise<void> => {
        const eventId = generateEventId();
        return await apiService.updateGeneralData(data, eventId);
    }

    const upsertHouse = async (house: DeepPartial<House>): Promise<string> => {
        const eventId = generateEventId();
        return await apiService.upsertHouse(house, eventId);
    }

    const deleteHouse = async (id: string): Promise<void> => {
        const eventId = generateEventId();
        return await apiService.deleteHouse(id, eventId);
    }

    const restoreBackup = async (key: string): Promise<void> => {
        const eventId = generateEventId();
        return await apiService.restoreBackup(key, eventId);
    }

    return (
        <SiteDataContext.Provider value={{
            generalData,
            houses,
            isLoading,
            version,
            updateGeneralData,
            upsertHouse,
            deleteHouse,
            restoreBackup
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
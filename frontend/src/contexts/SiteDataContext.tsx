'use client'

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { DeepPartial, EventMessage, EventObject, GeneralData, generateEventId, House, SiteData } from 'living-mile-high-lib';
import services from '@/di';

type SiteDataContextType = {
    isLoading: boolean;
    houses: House[];
    generalData: GeneralData | undefined;
    foreignEventId: string | undefined;
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
    const [generalData, setGeneralData] = useState<GeneralData | undefined>(undefined);
    const [houses, setHouses] = useState<House[]>([]);
    const [localEventIds, setLocalEventIds] = useState<string[]>([]);
    const [foreignEventId, setForeignEventId] = useState<string | undefined>(undefined);
    const { eventService, cdnService, apiService } = services();

    const fetchSiteData = useCallback(async () => {
        try {
            const data: SiteData = await cdnService.fetchSiteData();
            const { houses: newHouses, ...newGeneralData } = data;
            setGeneralData(newGeneralData);
            setHouses(newHouses);
        } catch (error) {
            console.error('Failed to fetch site data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [cdnService]);

    useEffect(() => {
        const handleEvent = (data: any) => {
            const { message, eventId }: EventObject = data;
            if (message === EventMessage.SITE_UPDATED) {
                if (eventId) {
                    if (localEventIds.includes(eventId)) {
                        setLocalEventIds(prevIds => prevIds.filter(id => id !== eventId));
                    } else {
                        setForeignEventId(eventId);
                    }
                }
                fetchSiteData();
            }
        };

        fetchSiteData();

        eventService.addEventHandler(handleEvent);

        return () => {
            eventService.removeEventHandler(handleEvent);
        };
    }, [fetchSiteData, eventService, localEventIds]);

    const withEventId = async <T extends any>(fn: (eventId: string) => Promise<T>): Promise<T> => {
        const id = generateEventId();
        setLocalEventIds(prevIds => [...prevIds, id]);
        try {
            return await fn(id);
        } catch (error) {
            setLocalEventIds(prevIds => prevIds.filter(id => id !== id));
            throw error;
        }
    }

    const updateGeneralData = async (data: DeepPartial<GeneralData>): Promise<void> => {
        return await withEventId(eventId => apiService.updateGeneralData(data, eventId));
    }

    const upsertHouse = async (house: DeepPartial<House>): Promise<string> => {
        return await withEventId(eventId => apiService.upsertHouse(house, eventId));
    }

    const deleteHouse = async (id: string): Promise<void> => {
        return await withEventId(eventId => apiService.deleteHouse(id, eventId));
    }

    const restoreBackup = async (key: string): Promise<void> => {
        return await withEventId(eventId => apiService.restoreBackup(key, eventId));
    }

    return (
        <SiteDataContext.Provider value={{
            generalData,
            houses,
            isLoading,
            foreignEventId,
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
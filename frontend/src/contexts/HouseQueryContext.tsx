'use client'

import { HouseQuery } from '@/types';
import { House } from 'living-mile-high-lib';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSiteData } from './SiteDataContext';

type HouseQueryContextType = {
    houses: House[];
    setHouseQueries: (...queries: HouseQuery[]) => void;
};

const HouseQueryContext = createContext<HouseQueryContextType | undefined>(undefined);

const caseInsensitiveContains = (string: string, substring: string) => {
    return string.toLowerCase().includes(substring.toLowerCase());
}

export const HouseQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const { houses: allHouses } = useSiteData();
    const [queries, setQueries] = useState<HouseQuery[] | undefined>(undefined);
    const [houses, setHouses] = useState<House[]>([]);

    const queryList = useMemo(() => {
        if (queries === undefined) return [];
        if (Array.isArray(queries)) return queries;
        return [queries];
    }, [queries]);

    const queryHouses = useCallback((query: HouseQuery, houses: House[]): House[] => {
        return houses.filter(house => {
            if (query.isSelectedWork !== undefined && house.isSelectedWork !== query.isSelectedWork) return false;
            if (query.isForSale !== undefined && house.isForSale !== query.isForSale) return false;
            if (query.isDeveloped !== undefined && house.isDeveloped !== query.isDeveloped) return false;
            if (query.addressContains && !caseInsensitiveContains(house.address, query.addressContains)) return false;
            if (query.neighborhoodContains && (!house.neighborhood || !caseInsensitiveContains(house.neighborhood, query.neighborhoodContains))) return false;
            return true;
        });
    }, []);

    const configure = useCallback((...queries: HouseQuery[]) => {
        setQueries(queries);
    }, []);

    useEffect(() => {
        if (queries) {
            const results = queryList.reduce((acc, query) => acc.concat(queryHouses(query, allHouses)), [] as House[]);
            const uniqueResults = Array.from(new Set(results));
            setHouses(uniqueResults);
        }
    }, [queries, allHouses, queryHouses, queryList]);

    return (
        <HouseQueryContext.Provider value={{ houses, setHouseQueries: configure }}>
            {children}
        </HouseQueryContext.Provider>
    );
};

export const useHouseQuery = (): HouseQueryContextType => {
    const context = useContext(HouseQueryContext);
    if (context === undefined) {
        throw new Error('useHouseQuery must be used within a HouseQueryProvider');
    }
    return context;
};
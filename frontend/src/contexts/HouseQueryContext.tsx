'use client'

import { HouseCompare, HouseQuery, HouseSortName } from '@/types';
import { House } from 'living-mile-high-lib';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSiteData } from './SiteDataContext';
import { createHouseSorts, createMultiCompare, dateNumber } from '@/utils/sorting';

type HouseQueryContextType = {
    houses: House[];
    query: HouseQuery[] | HouseQuery | undefined;
    setQuery: React.Dispatch<React.SetStateAction<HouseQuery[] | HouseQuery | undefined>>;
    setSort: (sort: HouseSortName | HouseSortName[]) => void;
};

const HouseQueryContext = createContext<HouseQueryContextType | undefined>(undefined);

const caseInsensitiveContains = (string: string, substring: string) => {
    return string.toLowerCase().includes(substring.toLowerCase());
}

export const HouseQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const { houses: allHouses, generalData } = useSiteData();
    const defaultMainImages = useMemo(() => generalData!.defaultImages, [generalData]);
    const [query, setQuery] = useState<HouseQuery[] | HouseQuery | undefined>(undefined);
    const [sorts, setSorts] = useState<HouseCompare[]>([]);
    const [houses, setHouses] = useState<House[]>([]);
    const houseSorts = useMemo(() => createHouseSorts(defaultMainImages), [defaultMainImages]);

    const queryList = useMemo(() => {
        if (query === undefined) return [];
        if (Array.isArray(query)) return query;
        return [query];
    }, [query]);

    const queryHouses = useCallback((query: HouseQuery, houses: House[]): House[] => {
        return houses.filter(house => {
            if (query.isSelectedWork !== undefined && house.isSelectedWork !== query.isSelectedWork) return false;
            if (query.isForSale !== undefined && house.isForSale !== query.isForSale) return false;
            if (query.isDeveloped !== undefined && house.isDeveloped !== query.isDeveloped) return false;
            if (query.addressContains && !caseInsensitiveContains(house.address, query.addressContains)) return false;
            if (query.neighborhoodContains && house.neighborhood && !caseInsensitiveContains(house.neighborhood, query.neighborhoodContains)) return false;
            return true;
        });
    }, []);

    const setSort = useCallback((sort: HouseSortName | HouseSortName[]) => {
        const sortNameList = Array.isArray(sort) ? sort : [sort];
        const sortList = sortNameList.map(sortName => houseSorts[sortName]);
        setSorts(sortList);
    }, [houseSorts]);

    useEffect(() => {
        if (query) {
            const results = queryList.reduce((acc, query) => acc.concat(queryHouses(query, allHouses)), [] as House[]);
            const uniqueResults = Array.from(new Set(results));

            const multiSort = createMultiCompare(sorts);

            const sortedResults = uniqueResults.sort(multiSort);
            setHouses(sortedResults);
        }
    }, [query, allHouses, queryHouses, queryList, sorts, houseSorts]);

    return (
        <HouseQueryContext.Provider value={{ houses, query, setQuery, setSort }}>
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
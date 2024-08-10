'use client'

import { HouseCompare, HouseQuery, HouseSortBy } from '@/types';
import { House } from 'living-mile-high-lib';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSiteData } from './SiteDataContext';
import { createHouseSorts, createMultiCompare } from '@/utils/sorting';

type ConfigureOptions = {
    query?: HouseQuery[] | HouseQuery;
    sort?: HouseSortBy[] | HouseSortBy;
}

type HouseQueryContextType = {
    houses: House[];
    configure: (options: ConfigureOptions) => void;
};

const HouseQueryContext = createContext<HouseQueryContextType | undefined>(undefined);

const caseInsensitiveContains = (string: string, substring: string) => {
    return string.toLowerCase().includes(substring.toLowerCase());
}

export const HouseQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const { houses: allHouses, generalData } = useSiteData();
    const defaultMainImages = useMemo(() => generalData!.defaultImages, [generalData]);
    const [queries, setQueries] = useState<HouseQuery[] | undefined>(undefined);
    const [sorts, setSorts] = useState<HouseCompare[]>([]);
    const [houses, setHouses] = useState<House[]>([]);
    const houseSorts = useMemo(() => createHouseSorts(defaultMainImages), [defaultMainImages]);

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
            if (query.neighborhoodContains && house.neighborhood && !caseInsensitiveContains(house.neighborhood, query.neighborhoodContains)) return false;
            return true;
        });
    }, []);

    const configure = useCallback((options: ConfigureOptions) => {
        const { query, sort } = options;
        if (query) {
            const queryList = Array.isArray(query) ? query : [query];
            setQueries(queryList);
        }

        if (sort) {
            const sortNameList = Array.isArray(sort) ? sort : [sort];
            const sortList = sortNameList.map(sortName => houseSorts[sortName]);
            setSorts(sortList);
        }
    }, [houseSorts]);

    useEffect(() => {
        if (queries) {
            const results = queryList.reduce((acc, query) => acc.concat(queryHouses(query, allHouses)), [] as House[]);
            const uniqueResults = Array.from(new Set(results));

            const multiSort = createMultiCompare(sorts);

            const sortedResults = uniqueResults.sort(multiSort);
            setHouses(sortedResults);
        }
    }, [queries, allHouses, queryHouses, queryList, sorts, houseSorts]);

    return (
        <HouseQueryContext.Provider value={{ houses, configure }}>
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
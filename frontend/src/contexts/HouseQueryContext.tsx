'use client'

import { HouseQuery, HouseSort } from '@/types';
import { House } from 'living-mile-high-lib';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSiteData } from './SiteDataContext';

type HouseQueryContextType = {
    houses: House[];
    query: HouseQuery;
    sort: HouseSort;
    setQuery: React.Dispatch<React.SetStateAction<HouseQuery>>;
    setSort: React.Dispatch<React.SetStateAction<HouseSort>>;
};

const HouseQueryContext = createContext<HouseQueryContextType | undefined>(undefined);

const caseInsensitiveContains = (string: string, substring: string) => {
    return string.toLowerCase().includes(substring.toLowerCase());
}

const dateNumber = (dateString: string) => {
    return new Date(dateString).getTime();
}

const sorters = {
    [HouseSort.LEXICOGRAPHIC]: (a: House, b: House) => a.address.localeCompare(b.address),
    [HouseSort.CREATED_AT_NEWEST]: (a: House, b: House) => dateNumber(b.createdAt!) - dateNumber(a.createdAt!),
    [HouseSort.CREATED_AT_OLDEST]: (a: House, b: House) => dateNumber(a.createdAt!) - dateNumber(b.createdAt!),
    [HouseSort.UPDATED_AT_NEWEST]: (a: House, b: House) => dateNumber(b.updatedAt!) - dateNumber(a.updatedAt!),
    [HouseSort.UPDATED_AT_OLDEST]: (a: House, b: House) => dateNumber(a.updatedAt!) - dateNumber(b.updatedAt!),
}

export const HouseQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const { houses: allHouses } = useSiteData();
    const [query, setQuery] = useState<HouseQuery>({});
    const [sort, setSort] = useState<HouseSort>(HouseSort.LEXICOGRAPHIC);
    const [houses, setHouses] = useState<House[]>([]);

    const queryHouses = useCallback((query: HouseQuery, houses: House[]): House[] => {
        return houses.filter(house => {
            if (query.isSelectedWork !== undefined && house.isSelectedWork !== query.isSelectedWork) return false;
            if (query.isForSale !== undefined && house.isForSale !== query.isForSale) return false;
            if (query.isDeveloped !== undefined && house.isDeveloped !== query.isDeveloped) return false;
            if (query.addressContains && !caseInsensitiveContains(house.address, query.addressContains)) return false;
            if (query.neighborhoodContains && !caseInsensitiveContains(house.neighborhood, query.neighborhoodContains)) return false;
            return true;
        });
    }, []);

    useEffect(() => {
        const result = queryHouses(query, allHouses);
        const sortedResults = result.sort(sorters[sort]);
        setHouses(sortedResults);
    }, [query, allHouses, queryHouses, sort]);

    return (
        <HouseQueryContext.Provider value={{ houses, query, setQuery, sort, setSort }}>
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
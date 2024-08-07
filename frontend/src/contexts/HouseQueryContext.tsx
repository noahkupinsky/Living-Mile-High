'use client'

import { HouseQuery, HouseSort } from '@/types';
import { House } from 'living-mile-high-lib';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSiteData } from './SiteDataContext';

type HouseQueryContextType = {
    houses: House[];
    query: HouseQuery[] | HouseQuery | undefined;
    sort: HouseSort;
    setQuery: React.Dispatch<React.SetStateAction<HouseQuery[] | HouseQuery | undefined>>;
    setSort: React.Dispatch<React.SetStateAction<HouseSort>>;
};

const HouseQueryContext = createContext<HouseQueryContextType | undefined>(undefined);

const caseInsensitiveContains = (string: string, substring: string) => {
    return string.toLowerCase().includes(substring.toLowerCase());
}

const dateNumber = (dateString: string) => {
    return new Date(dateString).getTime();
}

export const HouseQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const { houses: allHouses, generalData } = useSiteData();
    const defaultMainImages = useMemo(() => generalData!.defaultImages, [generalData]);
    const [query, setQuery] = useState<HouseQuery[] | HouseQuery | undefined>(undefined);
    const [sort, setSort] = useState<HouseSort>(HouseSort.NON_DEFAULT_LEXICOGRAPHIC);
    const [houses, setHouses] = useState<House[]>([]);

    const hasDefaultMainImage = useCallback((house: House) => {
        return defaultMainImages.includes(house.mainImage);
    }, [defaultMainImages]);

    const sorters = useMemo(() => {
        return {
            [HouseSort.NON_DEFAULT_LEXICOGRAPHIC]: (a: House, b: House) => {
                const [aHasDefault, bHasDefault] = [hasDefaultMainImage(a), hasDefaultMainImage(b)];
                if (aHasDefault && !bHasDefault) return 1;
                if (!aHasDefault && bHasDefault) return -1;
                return a.address.localeCompare(b.address);
            },
            [HouseSort.LEXICOGRAPHIC]: (a: House, b: House) => a.address.localeCompare(b.address),
            [HouseSort.CREATED_AT_NEWEST]: (a: House, b: House) => dateNumber(b.createdAt!) - dateNumber(a.createdAt!),
            [HouseSort.CREATED_AT_OLDEST]: (a: House, b: House) => dateNumber(a.createdAt!) - dateNumber(b.createdAt!),
            [HouseSort.UPDATED_AT_NEWEST]: (a: House, b: House) => dateNumber(b.updatedAt!) - dateNumber(a.updatedAt!),
            [HouseSort.UPDATED_AT_OLDEST]: (a: House, b: House) => dateNumber(a.updatedAt!) - dateNumber(b.updatedAt!),
        }
    }, [hasDefaultMainImage]);

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

    useEffect(() => {
        if (query) {
            const queryList = Array.isArray(query) ? query : [query];
            const results = queryList.reduce((acc, query) => acc.concat(queryHouses(query, allHouses)), [] as House[]);
            const uniqueResults = Array.from(new Set(results));
            const sortedResults = uniqueResults.sort(sorters[sort]);
            setHouses(sortedResults);
        }
    }, [query, allHouses, queryHouses, sort, sorters]);

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
'use client'

import { HouseCompare, HouseQuery, HouseSortName } from '@/types';
import { House } from 'living-mile-high-lib';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSiteData } from './SiteDataContext';
import { createMultiCompare, dateNumber } from '@/utils/sorting';

type HouseQueryContextType = {
    houses: House[];
    query: HouseQuery[] | HouseQuery | undefined;
    sort: HouseSortName | HouseSortName[];
    setQuery: React.Dispatch<React.SetStateAction<HouseQuery[] | HouseQuery | undefined>>;
    setSort: React.Dispatch<React.SetStateAction<HouseSortName | HouseSortName[]>>;
};

const HouseQueryContext = createContext<HouseQueryContextType | undefined>(undefined);

const caseInsensitiveContains = (string: string, substring: string) => {
    return string.toLowerCase().includes(substring.toLowerCase());
}

const SortHousesLexicographically = (a: House, b: House) => {
    return a.address.localeCompare(b.address);
}

export const HouseQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const { houses: allHouses, generalData } = useSiteData();
    const defaultMainImages = useMemo(() => generalData!.defaultImages, [generalData]);
    const [query, setQuery] = useState<HouseQuery[] | HouseQuery | undefined>(undefined);
    const [sorts, setSorts] = useState<HouseCompare[]>([SortHousesLexicographically]);
    const [houses, setHouses] = useState<House[]>([]);

    const queryList = useMemo(() => {
        if (query === undefined) return [];
        if (Array.isArray(query)) return query;
        return [query];
    }, [query]);

    const hasDefaultMainImage = useCallback((house: House) => {
        return defaultMainImages.includes(house.mainImage);
    }, [defaultMainImages]);

    const sorters: { [key in HouseSortName]: HouseCompare } = useMemo(() => {
        return {
            [HouseSortName.NON_DEFAULT]: (a: House, b: House) => {
                const [aHasDefault, bHasDefault] = [hasDefaultMainImage(a), hasDefaultMainImage(b)];
                if (aHasDefault && !bHasDefault) return -1;
                if (!aHasDefault && bHasDefault) return 1;
                return 0;
            },
            [HouseSortName.PRIORITY]: (a: House, b: House) => {
                const [aPrio, bPrio] = [a.priority ?? Infinity, b.priority ?? Infinity];
                if (aPrio < bPrio) return 1;
                if (aPrio > bPrio) return -1;
                return 0;
            },
            [HouseSortName.LEXICOGRAPHIC]: SortHousesLexicographically,
            [HouseSortName.CREATED_AT]: (a: House, b: House) => dateNumber(b.createdAt!) - dateNumber(a.createdAt!),
            [HouseSortName.UPDATED_AT]: (a: House, b: House) => dateNumber(b.updatedAt!) - dateNumber(a.updatedAt!),
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
            const results = queryList.reduce((acc, query) => acc.concat(queryHouses(query, allHouses)), [] as House[]);
            const uniqueResults = Array.from(new Set(results));

            const multiSort = createMultiCompare(sorts);

            const sortedResults = uniqueResults.sort(multiSort);
            setHouses(sortedResults);
        }
    }, [query, allHouses, queryHouses, queryList, sorts, sorters]);

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
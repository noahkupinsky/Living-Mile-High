import { HouseQueryProvider, useHouseQuery } from "@/contexts/HouseQueryContext";
import { HouseSortProvider, useHouseSort } from "@/contexts/HouseSortContext";
import { HouseQuerySortConfig } from "@/types";
import { House } from "living-mile-high-lib";
import { useEffect, useMemo } from "react";

export const HouseQuerySortProvider = ({ children }: { children: React.ReactNode }) => (
    <HouseQueryProvider>
        <HouseSortProvider>
            {children}
        </HouseSortProvider>
    </HouseQueryProvider>
)

export function useHouseQuerySort(config: Partial<HouseQuerySortConfig>): House[] {
    const { houses, setHouseQueries } = useHouseQuery();
    const { sortHouses, setHouseSorts } = useHouseSort();

    useEffect(() => {
        if (config.queries) setHouseQueries(...config.queries);
        if (config.sorts) setHouseSorts(...config.sorts);
    }, [setHouseQueries, setHouseSorts, config]);

    return useMemo(() => {
        return sortHouses(houses);
    }, [sortHouses, houses]);
}

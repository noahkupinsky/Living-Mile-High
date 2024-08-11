import { HouseCompare, HouseSortBy, HouseSortCriteria } from "@/types";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useSiteData } from "./SiteDataContext";
import { House } from "living-mile-high-lib";
import { createMultiCompare, dateNumber, reverseCompare } from "@/utils/sorting";


type HouseSortContextType = {
    setHouseSorts: (...sorts: HouseSortCriteria[]) => void;
    sortHouses: (houses: House[]) => House[];
};


export const HouseSortContext = createContext<HouseSortContextType | undefined>(undefined)


export const HouseSortProvider = ({ children }: { children: React.ReactNode }) => {
    const { generalData } = useSiteData();
    const [compares, setCompares] = useState<HouseCompare[]>([]);

    const defaultMainImages = useMemo(() => generalData!.defaultImages, [generalData]);
    const houseSorts: { [key in HouseSortBy]: HouseCompare } = useMemo(() => {
        const hasDefaultMainImage = (house: House) => {
            return defaultMainImages.includes(house.mainImage);
        };

        return {
            [HouseSortBy.NON_DEFAULT]: (a, b) => {
                const [aHasDefault, bHasDefault] = [hasDefaultMainImage(a), hasDefaultMainImage(b)];
                if (aHasDefault && !bHasDefault) return 1;
                if (!aHasDefault && bHasDefault) return -1;
                return 0;
            },
            [HouseSortBy.PRIORITY]: (a, b) => {
                const [aPrio, bPrio] = [a.priority ?? Infinity, b.priority ?? Infinity];
                if (aPrio < bPrio) return -1;
                if (aPrio > bPrio) return 1;
                return 0;
            },
            [HouseSortBy.ADDRESS]: (a, b) => a.address.localeCompare(b.address),
            [HouseSortBy.CREATED_AT]: (a, b) => dateNumber(b.createdAt!) - dateNumber(a.createdAt!),
            [HouseSortBy.UPDATED_AT]: (a, b) => dateNumber(b.updatedAt!) - dateNumber(a.updatedAt!),

        }
    }, [defaultMainImages]);

    const sortToCompare = useCallback((sort: HouseSortCriteria): HouseCompare => {
        const houseSort = houseSorts[sort.sortBy];
        return sort.reverse ? reverseCompare(houseSort) : houseSort;
    }, [houseSorts]);

    const setHouseSorts = useCallback((...sorts: HouseSortCriteria[]) => {
        setCompares(sorts.map(sortToCompare));
    }, [sortToCompare]);

    const sortHouses = useCallback((houses: House[]) => {
        const multiCompare = createMultiCompare(compares);
        return houses.sort(multiCompare);
    }, [compares]);

    return (
        <HouseSortContext.Provider value={{ setHouseSorts, sortHouses }}>
            {children}
        </HouseSortContext.Provider>
    );
}

export const useHouseSort = (): HouseSortContextType => {
    const context = useContext(HouseSortContext);
    if (context === undefined) {
        throw new Error('useHouseSort must be used within a HouseSortProvider');
    }
    return context;
};
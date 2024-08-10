import { Compare, HouseCompare, HouseSortBy } from "@/types";
import { House } from "living-mile-high-lib";

export const createMultiCompare = <T extends any>(compareList: Compare<T>[]): Compare<T> => {
    const sortFromIndex = (a: T, b: T, compares: Compare<T>[], i: number): number => {
        if (compares.length === 0 || i >= compares.length) return 0;

        const comparator = compares[i];
        const comparison = comparator(a, b);
        if (comparison === 0) {
            return sortFromIndex(a, b, compares, i + 1);
        }
        return comparison;
    }

    return (a: T, b: T) => {
        return sortFromIndex(a, b, compareList, 0);
    }
}

export const reverseCompare = <T extends any>(compare: Compare<T>): Compare<T> => {
    return (a: T, b: T) => {
        return -compare(a, b);
    }
}

export const dateNumber = (dateString: string) => {
    return new Date(dateString).getTime();
}

export const createHouseSorts = (defaultMainImages: string[]): { [key in HouseSortBy]: HouseCompare } => {
    const hasDefaultMainImage = (house: House) => {
        return defaultMainImages.includes(house.mainImage);
    };

    return {
        [HouseSortBy.NON_DEFAULT]: (a: House, b: House) => {
            const [aHasDefault, bHasDefault] = [hasDefaultMainImage(a), hasDefaultMainImage(b)];
            if (aHasDefault && !bHasDefault) return 1;
            if (!aHasDefault && bHasDefault) return -1;
            return 0;
        },
        [HouseSortBy.PRIORITY]: (a: House, b: House) => {
            const [aPrio, bPrio] = [a.priority ?? Infinity, b.priority ?? Infinity];
            if (aPrio < bPrio) return 1;
            if (aPrio > bPrio) return -1;
            return 0;
        },
        [HouseSortBy.ADDRESS]: (a: House, b: House) => a.address.localeCompare(b.address),
        [HouseSortBy.CREATED_AT]: (a: House, b: House) => dateNumber(b.createdAt!) - dateNumber(a.createdAt!),
        [HouseSortBy.UPDATED_AT]: (a: House, b: House) => dateNumber(b.updatedAt!) - dateNumber(a.updatedAt!),
    }
}

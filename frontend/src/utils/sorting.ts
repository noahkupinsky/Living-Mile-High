import { Compare } from '@/types';

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

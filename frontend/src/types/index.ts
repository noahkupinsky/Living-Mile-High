import { EventObject, House, HouseStats } from 'living-mile-high-lib';

export enum AlertTitle {
    SUCCESS = 'Success',
    ERROR = 'Error',
    LOADING = 'Loading',
    WARNING = 'Warning',
}


export type AlertType = {
    title: AlertTitle,
    message: string,
    duration?: number
}

export type WithAlertOptions = {
    noLoading?: boolean
}

export class Alert implements AlertType {
    constructor(public title: AlertTitle, public message: string, public duration?: number) { }
}

export type SiteEventHandler = (event: EventObject, isLocal: boolean) => Promise<void>;

export type NavTab = {
    name: string;
    path: string;
    isAdmin: boolean;
}

export type HouseQuery = {
    isSelectedWork?: boolean;
    isForSale?: boolean;
    isDeveloped?: boolean;
    addressContains?: string;
    neighborhoodContains?: string;
};

export enum HouseSortBy {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    ADDRESS = 'address',
    NON_DEFAULT = 'nonDefault',
    PRIORITY = 'priority',
}

export type HouseStatKeys = keyof HouseStats

export type ImageFormat = string | File | Blob

export type HouseOnClickCreator = (house: House) => (() => void) | undefined

export type Compare<T> = (a: T, b: T) => number;

export type HouseCompare = Compare<House>;
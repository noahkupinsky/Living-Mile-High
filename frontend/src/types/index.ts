import { EventObject, HouseStats } from 'living-mile-high-lib';

export interface ApiService {
    fetch(route: string, params: Record<string, any>): Promise<any>;
    verifyAuthenticated(): Promise<boolean>;
    login(username: string, password: string): Promise<boolean>;
}

export type Services = {
    apiService: ApiService;
}

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

export type AlertOptions = {
    noLoad?: boolean
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

export enum HouseSort {
    CREATED_AT_NEWEST = 'Created At (newest first)',
    CREATED_AT_OLDEST = 'Created At (oldest first)',
    UPDATED_AT_NEWEST = 'Updated At (newest first)',
    UPDATED_AT_OLDEST = 'Updated At (oldest first)',
    LEXICOGRAPHIC = 'Alphabetical',
}

export type HouseStatKeys = keyof HouseStats

export type ImageFormat = string | File | Blob
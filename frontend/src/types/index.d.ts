import { EventMessage, EventObject, House, HouseStats, SiteData } from 'living-mile-high-lib';

export interface ApiService {
    fetch(route: string, params: Record<string, any> = {}): Promise<any>;
    verifyAuthenticated(): Promise<boolean>;
    login(username: string, password: string): Promise<boolean>;
}

export type Services = {
    apiService: ApiService;
}

export type SiteEventHandler = (event: EventObject, isLocal: boolean) => Promise<void>;
export type SiteUpdateHandler = (isLocal: boolean, siteData: SiteData) => Promise<void>
export type EventIdInjector = <T>(fn: (eventId: string) => Promise<T>) => Promise<T>

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

export type HouseStatKeys = keyof HouseStats

export type ImageFormat = string | File
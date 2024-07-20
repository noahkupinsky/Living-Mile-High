import { DeepPartial, House, GeneralData, SiteData } from "living-mile-high-lib";

export interface HouseService {
    getHouseObjects(): Promise<House[]>;
    upsertHouse(house: DeepPartial<House>): Promise<string>;
    deleteHouse(id: string): Promise<boolean>;
}

export interface AdminService {
    getUserByLoginInfo(username: string, password: string): Promise<any>;
    createUser(username: string, password: string): Promise<any>;
    getUserById(id: string): Promise<any>;
}

export interface GeneralDataService {
    update(updates: DeepPartial<GeneralData>): Promise<void>;
    getGeneralData(): Promise<GeneralData>;
}

export interface StateService {
    getState(): Promise<SiteData>;
    serializeState(): Promise<string>;
    deserializeState(state: string): Promise<void>;
}
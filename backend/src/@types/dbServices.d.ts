export interface HouseService {
    getHouseObjects(): Promise<House[]>;
    upsertHouse(house: DeepPartial<House>): Promise<void>;
    allImages(): Promise<string[]>;
    allNeighborhoods(): Promise<string[]>;
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
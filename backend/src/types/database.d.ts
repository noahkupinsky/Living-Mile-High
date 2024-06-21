export type DatabaseServiceDict = { adminService: AdminService, houseService: HouseService };

export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get services(): DatabaseServiceDict;
}
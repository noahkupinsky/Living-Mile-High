export type DatabaseServiceDict = { adminService: AdminService, houseService: HouseService };

export interface Database implements ServiceProvider<DatabaseServiceDict> {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get services(): DatabaseServiceDict;
}
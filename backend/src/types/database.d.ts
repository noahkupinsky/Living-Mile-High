import { ServiceProvider } from './serviceProvider';

export type DatabaseServiceDict = { adminService: AdminService, houseService: HouseService };

export type Database = ServiceProvider<DatabaseServiceDict>
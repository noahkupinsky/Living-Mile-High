export { CdnService } from './cdn';
export { AdminService, AdminRecord } from './admin';
export { HouseService, HouseRecord } from './house';
export { ImageService, ImageCategory } from './image';
export { ExpressMiddleware, ExpressEndpoint } from './express';
export { AppDataService } from './appData';
export { IAppServices, ServiceDict } from './appServices'; e

export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    adminService: AdminService;
    houseService: HouseService;
}


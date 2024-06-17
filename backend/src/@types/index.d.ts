import { User } from 'passport';
export { AdminService, AdminRecord } from './admin';
export { HouseService, HouseRecord, HouseFilter } from './house';
export { ImageService } from './image';
export { ExpressMiddleware, ExpressEndpoint } from './express';

export interface IAppServices {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getService(key: ServiceKey): any;
}

export type ServiceKey = 'house' | 'admin' | 'image';

export type ServiceDict = {
    house: HouseService,
    admin: AdminService,
    image: ImageService
}

export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    adminService: AdminService;
    houseService: HouseService;
}



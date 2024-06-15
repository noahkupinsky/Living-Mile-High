import { User } from 'passport';
export { AdminService, AdminRecord } from './admin';
export { HouseService, HouseRecord } from './house';
export { ImageService } from './image';
export { ExpressMiddleware, ExpressEndpoint } from './express';

export interface IAppServices {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    imageService: ImageService;
    adminService: AdminService;
    houseService: HouseService;
}

export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    adminService: AdminService;
    houseService: HouseService;
}



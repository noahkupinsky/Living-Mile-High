import { HouseService } from './house';
import { AdminService } from './admin';
import { ImageService } from './image';

export interface IAppServices {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get services(): ServiceDict;
}

export type ServiceDict = {
    houseService: HouseService;
    adminService: AdminService;
    imageService: ImageService;
};

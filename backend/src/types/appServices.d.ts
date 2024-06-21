import { HouseService } from './house';
import { AdminService } from './admin';
import { ImageService } from './image';
import { ServiceProvider } from './serviceProvider';

export interface IAppServices implements ServiceProvider<AppServiceDict> {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get services(): AppServiceDict;
}

export type AppServiceDict = {
    houseService: HouseService;
    adminService: AdminService;
    imageService: ImageService;
};

import { Server as HTTPServer } from 'http';
import { HouseService } from './house';
import { AdminService } from './admin';
import { ImageService } from './image';
import { ServiceProvider } from './serviceProvider';
import { AppDataService } from './appData';
import { WebSocketService } from './server';

export type AppServiceProvider = ServiceProvider<AppServiceDict>

export type AppServiceDict = {
    houseService: HouseService;
    adminService: AdminService;
    imageService: ImageService;
    appDataService: AppDataService;
    webSocketService: WebSocketService;
};

export type ServicesConfig = {
    useLocal?: boolean,
    server: HTTPServer
}

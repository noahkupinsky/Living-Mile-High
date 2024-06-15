import { NextFunction, Request, Response } from 'express';
import { User } from 'passport';

// declare global {
//     namespace Express {
//         interface User {
//             id: string;
//             role: string;
//             email?: string;
//         }

//         interface Request {
//             user?: User;
//         }
//     }
// }

export type ExpressMiddleware<
    Req = Request,
    Res = Response
> = (
    req: Req,
    res: Res,
    next: NextFunction
) => any;

export type ExpressEndpoint<
    Req = Request,
    Res = Response
> = (
    req: Req,
    res: Res
) => any;

export interface AppConfig {
    database: Database
}

export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    adminService: AdminService;
    houseService: HouseService;
}

export interface AdminRecord {
    username: string
    password: string
}

export interface HouseRecord {
    address: string
}

// IAdminService.ts
export interface AdminService {
    async getUserByLoginInfo(username: string, password: string): Promise<any>;
    async createUser(username: string, password: string): Promise<any>;
    async getUserById(id: string): Promise<any>;
}

export interface HouseService {
    async getHouseByAddress(address: string): Promise<any>;
}
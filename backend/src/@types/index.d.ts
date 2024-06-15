import { IDatabase } from "src/database"
import { NextFunction, Request, Response } from 'express';
import { User } from 'passport';

declare global {
    namespace Express {
        interface User {
            id: string;
            role: string;
            email?: string;
        }

        interface Request {
            user?: User;
        }
    }
}

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

export interface AdminRecord {
    email: string
}

export interface HouseRecord {
    address: string
}

export interface AppConfig {
    database: IDatabase
}

export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
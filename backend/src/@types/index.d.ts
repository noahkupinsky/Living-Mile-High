import { IDatabase } from "src/database"

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
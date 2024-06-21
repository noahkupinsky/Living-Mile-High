import { AppData } from "living-mile-high-types";

export interface AppDataService {
    getAppData(): Promise<AppData>;
    setAppData(data: AppData): Promise<AppData>;
}
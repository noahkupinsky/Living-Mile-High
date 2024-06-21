import { AppData } from "living-mile-high-types";

export interface AppDataService {
    get data(): Promise<AppData>;
    update(updates: AppData): Promise<AppData>;
}
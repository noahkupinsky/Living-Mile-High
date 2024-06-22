import { AppData } from "living-mile-high-types";

export interface AppDataService {
    getData(): Promise<DeepPartial<AppData>>;
    update(updates: DeepPartial<AppData>): Promise<AppData>;
}
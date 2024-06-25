import { House } from "living-mile-high-lib";

export enum CdnFixedKeys {
    HomeFirst = 'home-first',
    AppData = 'app-data'
}

export const AssetPrefix = "assets";

export const optionals = <T>(x: T) => (key: keyof T) => x[key] !== undefined ? { [key]: x[key] } : {};
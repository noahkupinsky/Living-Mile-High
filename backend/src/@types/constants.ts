export enum ContentCategory {
    ASSET = 'asset',
    BACKUP = 'backup'
}

export enum ContentType {
    TEXT = 'text/plain',
    JSON = 'application/json',
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    GIF = 'image/gif',
    BMP = 'image/bmp',
    WEBP = 'image/webp',
    TIFF = 'image/tiff',
    SVG = 'image/svg+xml',
    HEIF = 'image/heif',
    HEIC = 'image/heic',
}

export enum ContentPermission {
    PUBLIC = 'public-read',
    PRIVATE = 'private'
}

export enum BackupConfig {
    RETENTION_DAYS = 365,
    LOGARITHMIC_BASE = 5, // >= 2
    MAXIMUM_POWER = 3 // >= 1
}

export enum AssetConfig {
    RETENTION_DAYS = 1
}

export const REFRESH_CDN_CACHE_MAX_FREQUENCY = 1000;
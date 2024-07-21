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
    SVG = 'image/svg+xml'
}

export enum ContentPermission {
    PUBLIC = 'public-read',
    PRIVATE = 'private'
}

export const BACKUP_RETENTION_DAYS = 365;
export const BACKUP_LOGARITHMIC_BASE = 5;

export const ASSSET_RETENTION_DAYS = 1;
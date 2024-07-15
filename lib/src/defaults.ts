import { GeneralData } from './types';

export const DefaultAboutData = {
    text: "about",
    image: "https://placehold.co/400"
}

export const DefaultContactData = {
    text: "contact",
    image: "https://placehold.co/400"
}

export const DefaultPlaceholderImages = ["https://placehold.co/400"];
export const DefaultHomePageImages = ["https://placehold.co/400", "https://placehold.co/500", "https://placehold.co/600"];

export const DefaultGeneralData: GeneralData = {
    about: DefaultAboutData,
    contact: DefaultContactData,
    defaultImages: DefaultPlaceholderImages,
    homePageImages: DefaultHomePageImages
}

export enum CdnFixedKey {
    SITE_DATA = 'siteData',
    HOME_PAGE_FIRST = 'homePageFirst'
}

export enum EventMessage {
    SITE_UPDATED = 'site-updated',
    CONNECTED = 'connected'
}
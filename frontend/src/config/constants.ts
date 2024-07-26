import { HouseStatKeys } from "@/types";

export const HOME_PAGE_INTERVAL = 2000;

export const NEIGHBORHOOD_GROUPS: string[][] = [
    ["Bonnie Brae", "Belcaro", "Hilltop"]
]

export const NEIGHBORHOOD_SORT_ORDER = [
    "Washington Park",
    "Belcaro",
    "Hilltop",
    "Bonnie Brae",
    "North Denver",
    "South Denver",
]

export const STAT_TEMPLATES: [HouseStatKeys, string][] = [
    ["houseSquareFeet", "Approx. $ ft²"],
    ["lotSquareFeet", "$ ft² lot"],
    ["bedrooms", "$ bedrooms"],
    ["bathrooms", "$ bathrooms"],
    ["garageSpaces", "$ garage spaces"],
];

// cheat code type beat so that you don't have to change the url manually
export const LOGIN_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'
];

export const THEME_SEQUENCE = [
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'
];

export const SPLIT_CHAR = '$';

export const PHONE_NUMBER = '303-819-5250';
export const EMAIL_ADDRESS = 'tina@livingmilehigh.com';
export const MAX_WIDTH = '150rem';
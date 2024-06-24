import { AppData } from "living-mile-high-types";

export class AppDataValidator {
    public static validate(data: any): data is AppData {
        if (typeof data !== 'object' || data === null) {
            throw new Error('AppData must be an object');
        }

        const requiredProperties = ['about', 'contact', 'houses', 'placeholderImages', 'homeImages'];

        for (const prop of requiredProperties) {
            if (!(prop in data)) {
                throw new Error(`Missing required property: ${prop}`);
            }
        }

        this.validateAboutData(data.about);
        this.validateContactData(data.contact);
        this.validateHouses(data.houses);
        this.validatePlaceholders(data.placeholderImages);
        this.validateHomeImages(data.homeImages);
        return true;
    }

    private static validateAboutData(about: any): void {
        if (typeof about !== 'object' || about === null) {
            throw new Error('AboutData must be an object');
        }

        if (typeof about.text !== 'string') {
            throw new Error('AboutData text must be a string');
        }

        if (typeof about.image !== 'string') {
            throw new Error('AboutData image must be a string');
        }
    }

    private static validateContactData(contact: any): void {
        if (typeof contact !== 'object' || contact === null) {
            throw new Error('ContactData must be an object');
        }

        if (typeof contact.text !== 'string') {
            throw new Error('ContactData text must be a string');
        }

        if (typeof contact.image !== 'string') {
            throw new Error('ContactData image must be a string');
        }
    }

    private static validateHouses(houses: any): void {
        if (!Array.isArray(houses)) {
            throw new Error('Houses must be an array');
        }

        for (const house of houses) {
            this.validateHouse(house);
        }
    }

    private static validateHouse(house: any): void {
        if (typeof house !== 'object' || house === null) {
            throw new Error('House must be an object');
        }

        const requiredProperties = [
            'isDeveloped', 'isForSale', 'isSelectedWork',
            'address', 'mainImage', 'images', 'neighborhood', 'stats'
        ];

        for (const prop of requiredProperties) {
            if (!(prop in house)) {
                throw new Error(`House is missing required property: ${prop}`);
            }
        }

        if (typeof house.address !== 'string') {
            throw new Error('House address must be a string');
        }

        if (typeof house.mainImage !== 'string') {
            throw new Error('House mainImage must be a string');
        }

        if (!Array.isArray(house.images) || house.images.some((image: any) => typeof image !== 'string')) {
            throw new Error('House images must be an array of strings');
        }

        if (typeof house.neighborhood !== 'string') {
            throw new Error('House neighborhood must be a string');
        }

        this.validateHouseStats(house.stats);
    }

    private static validateHouseStats(stats: any): void {
        if (typeof stats !== 'object' || stats === null) {
            throw new Error('HouseStats must be an object');
        }

        const optionalProperties = [
            'houseSquareFeet', 'lotSquareFeet', 'bedrooms',
            'bathrooms', 'garageSpaces'
        ];

        for (const prop of optionalProperties) {
            if (prop in stats && typeof stats[prop] !== 'number') {
                throw new Error(`HouseStats property ${prop} must be a number`);
            }
        }
    }

    private static validatePlaceholders(placeholders: any): void {
        if (!Array.isArray(placeholders)) {
            throw new Error('Placeholders must be an array');
        }

        if (placeholders.some(placeholder => typeof placeholder !== 'string')) {
            throw new Error('Placeholders must be an array of strings');
        }

        // make sure placeholders has at least one element
        if (placeholders.length === 0) {
            throw new Error('Placeholders must have at least one element');
        }
    }

    private static validateHomeImages(homeImages: any): void {
        if (!Array.isArray(homeImages)) {
            throw new Error('HomeImages must be an array');
        }

        if (homeImages.some(homeImage => typeof homeImage !== 'string')) {
            throw new Error('HomeImages must be an array of strings');
        }
    }
}
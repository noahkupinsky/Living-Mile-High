import { SiteData } from "living-mile-high-lib";

function validateSiteData(data: any): data is SiteData {
    const requiredProperties = ['about', 'contact', 'houses', 'defaultImages', 'homePageImages'];

    validateObjectProperties(data, "SiteData", requiredProperties);

    const { houses, ...generalData } = data;

    validateGeneralData(generalData);

    validateArrayItems(houses, "Houses", validateHouse);

    return true;
}

function validateGeneralData(data: any): void {
    validateAboutData(data.about);

    validateContactData(data.contact);

    validatePlaceholders(data.defaultImages);

    validateHomePageImages(data.homePageImages);
}

function validateAboutData(about: any): void {
    validateObject(about, "AboutData");

    validateNonEmptyString(about.text, "AboutData text")

    validateNonEmptyString(about.image, "AboutData image url")
}

function validateContactData(contact: any): void {
    validateObject(contact, "ContactData");

    validateNonEmptyString(contact.text, "ContactData text")

    validateNonEmptyString(contact.image, "ContactData image url")
}

function validateHouse(house: any): void {
    const requiredProperties = [
        'isDeveloped', 'isForSale', 'isSelectedWork',
        'address', 'mainImage', 'images'
    ];

    validateObjectProperties(house, "House", requiredProperties);

    validateNonEmptyString(house.address, "House address");

    validateNonEmptyString(house.mainImage, "House mainImage url");

    validateArrayItems(house.images, "House images", validateNonEmptyString);

    if (house.neighborhood !== undefined && typeof house.neighborhood !== 'string') {
        throw new Error('House neighborhood must be undefined or a string');
    }

    validateHouseStats(house.stats);
}

function validateHouseStats(stats: any): void {
    if (stats === undefined) return;

    validateObject(stats, "HouseStats");

    const optionalProperties = [
        'houseSquareFeet', 'lotSquareFeet', 'bedrooms',
        'bathrooms', 'garageSpaces'
    ];

    for (const prop of optionalProperties) {
        if (prop in stats && stats[prop] !== undefined && typeof stats[prop] !== 'number') {
            throw new Error(`HouseStats property ${prop} must be a number`);
        }
    }
}

function validatePlaceholders(defaults: any): void {
    validateArrayItems(defaults, "DefaultImages", validateNonEmptyString);
}

function validateHomePageImages(homePageImages: any): void {
    validateArrayItems(homePageImages, "HomePageImages", validateNonEmptyString);

    if (homePageImages.length === 0) {
        throw new Error('HomePageImages must have at least one image');
    }
}

function validateNonEmptyString(value: any, name: string): void {
    if (typeof value !== 'string' || value === '') {
        throw new Error(`"${name}" must be a nonempty string`);
    }
}

function validateObject(value: any, name: string): void {
    if (typeof value !== 'object' || value === null) {
        throw new Error(`"${name}" must be an object`);
    }
}

function validateObjectProperties(value: any, name: string, requiredProperties: string[]): void {
    validateObject(value, name);

    for (const prop of requiredProperties) {
        if (!(prop in value)) {
            throw new Error(`${name} is missing required property: ${prop}`);
        }
    }
}

function validateArrayItems(value: any, name: string, validator: (value: any, name: string) => void): void {
    if (!Array.isArray(value)) {
        throw new Error(`${name} must be an array`);
    }

    for (const item of value) {
        validator(item, `element of ${name}`);
    }
}

export {
    validateSiteData,
    validateGeneralData,
    validateHouse,
};

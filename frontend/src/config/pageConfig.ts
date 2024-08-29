import { HouseSortBy, NavTabConfig, PageConfig } from "@/types";

const NonDefaultPriorityAddressSort = [
    { sortBy: HouseSortBy.NON_DEFAULT },
    { sortBy: HouseSortBy.PRIORITY, },
    { sortBy: HouseSortBy.ADDRESS }
];

const NonDefaultAddressSort = [
    { sortBy: HouseSortBy.NON_DEFAULT },
    { sortBy: HouseSortBy.ADDRESS }
]

const Pages: { [key: string]: PageConfig } = {
    FOR_SALE: {
        name: 'Projects For Sale',
        path: '/for-sale',
        isAdmin: false,
        queries: [{
            isForSale: true
        }],
        sorts: NonDefaultPriorityAddressSort
    },
    SELECTED_WORK: {
        name: 'Featured',
        path: '/selected-work',
        isAdmin: false,
        queries: [{
            isSelectedWork: true
        }],
        sorts: NonDefaultPriorityAddressSort
    },
    DEVELOPED: {
        name: 'Our Work',
        path: '/developed',
        isAdmin: false,
        queries: [{
            isDeveloped: true
        }],
        sorts: NonDefaultAddressSort
    },
    SOLD: {
        name: 'Real Estate Sales',
        path: '/sold',
        isAdmin: true,
        queries: [{
            isForSale: false
        }],
        sorts: NonDefaultAddressSort
    },
    ABOUT: {
        name: 'About',
        path: '/about',
        isAdmin: true
    },
    CONTACT: {
        name: 'Contact',
        path: '/contact',
        isAdmin: false
    },
    ADMIN: {
        name: 'Admin',
        path: '/admin',
        isAdmin: true
    }
};

export const filterNavTabs = (isAuthenticated: boolean): NavTabConfig[] => {
    return Object.values(Pages).filter(page => (!page.isAdmin || isAuthenticated));
}

export default Pages;
import { NavTab } from "@/types";

export const navTabs: NavTab[] = [
    {
        name: 'Selected Work',
        path: '/selected-work',
        isAdmin: false
    },
    {
        name: 'Projects For Sale',
        path: '/for-sale',
        isAdmin: false
    },
    {
        name: 'Developed',
        path: '/developed',
        isAdmin: false
    },
    {
        name: 'Sold',
        path: '/sold',
        isAdmin: false
    },
    {
        name: 'About',
        path: '/about',
        isAdmin: false
    },
    {
        name: 'Contact',
        path: '/contact',
        isAdmin: false
    },
    {
        name: 'Admin',
        path: '/admin',
        isAdmin: true
    }
];

export const filterNavTabs = (isAuthenticated: boolean): NavTab[] => {
    return navTabs.filter(tab => !tab.isAdmin || isAuthenticated);
}
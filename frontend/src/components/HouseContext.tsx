"use client";

import React, { createContext, useContext } from 'react';

const HouseContext = createContext<any>({
    houses: []
});

export const useHouseContext = () => {
    return useContext(HouseContext);
};

export type HouseContextProps = {
    children: React.ReactNode;
    value: any;
}

export const HouseProvider = ({ children, value }: HouseContextProps) => {
    return (
        <HouseContext.Provider value={value}>
            {children}
        </HouseContext.Provider>
    );
};
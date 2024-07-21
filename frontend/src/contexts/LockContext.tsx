'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';

type LockContextType = {
    isValid: boolean;
};

const LockContext = createContext<LockContextType | undefined>(undefined);

type LockProviderProps = {
    children: React.ReactNode;
    getter?: () => any; // Optional getter function
};

export const LockProvider = ({ children, getter }: LockProviderProps) => {
    const { foreignEventId } = useSiteData();
    const [isValid, setIsValid] = useState<boolean>(true);

    const [initialState] = useState(getter ? getter() : null);
    const [initialForeignEventId] = useState(foreignEventId);

    useEffect(() => {
        const foreignEventOccurred = foreignEventId !== initialForeignEventId;
        const newState = getter ? getter() : null;
        const stateChanged = foreignEventOccurred && (!getter || initialState !== newState);

        if (stateChanged) {
            setIsValid(false);
        }
    }, [getter, foreignEventId, initialForeignEventId, initialState]);

    return (
        <LockContext.Provider value={{ isValid }}>
            {children}
        </LockContext.Provider>
    );
};

export const useLock = (): LockContextType => {
    const context = useContext(LockContext);
    if (context === undefined) {
        throw new Error('useLock must be used within a LockProvider');
    }
    return context;
};
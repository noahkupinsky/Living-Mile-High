'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';

type LockContextType = {
    isValid: boolean;
    setIsValid: (value: boolean) => void;
};

const LockContext = createContext<LockContextType | undefined>(undefined);

type LockProviderProps = {
    children: React.ReactNode;
    getter?: () => any; // Optional getter function
};

export const LockProvider = ({ children, getter }: LockProviderProps) => {
    const { version } = useSiteData();
    const [isValid, setIsValid] = useState<boolean>(true);

    const [initialState] = useState(getter ? getter() : null);
    const [initialVersion] = useState(version);

    useEffect(() => {
        if (getter) {
            const currentState = getter();
            if (initialState !== currentState && version !== initialVersion) {
                setIsValid(false);
            }
        } else {
            if (version !== initialVersion) {
                setIsValid(false);
            }
        }
    }, [version, getter, initialState, initialVersion]);

    return (
        <LockContext.Provider value={{ isValid, setIsValid }}>
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
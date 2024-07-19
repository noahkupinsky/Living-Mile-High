'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';

type LockContextType = {
    isValid: boolean;
    expectChange: () => void;
    unexpectChange: () => void;
};

const LockContext = createContext<LockContextType | undefined>(undefined);

type LockProviderProps = {
    children: React.ReactNode;
    getter?: () => any; // Optional getter function
};

export const LockProvider = ({ children, getter }: LockProviderProps) => {
    const { version } = useSiteData();
    const [isValid, setIsValid] = useState<boolean>(true);
    const [expectedChanges, setExpectedChanges] = useState<number>(0);

    const [initialState, setInitialState] = useState(getter ? getter() : null);
    const [initialVersion, setInitialVersion] = useState(version);

    useEffect(() => {
        const versionChanged = version !== initialVersion;
        const newState = getter ? getter() : null;
        const stateChanged = versionChanged && (!getter || initialState !== newState);

        if (stateChanged) {
            if (expectedChanges > 0) {
                setInitialState(newState);
                setInitialVersion(version);
                setExpectedChanges(prev => prev - 1);
            } else {
                setIsValid(false);
            }
        }
    }, [version, getter, initialState, initialVersion]);

    const expectChange = () => {
        setExpectedChanges(prev => prev + 1);
    };

    const unexpectChange = () => {
        setExpectedChanges(prev => prev - 1);
    };

    return (
        <LockContext.Provider value={{ isValid, expectChange, unexpectChange }}>
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
'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { SiteUpdateHandler } from '@/types';
import services from '@/di';

type LockContextType = {
    isValid: boolean;
};

const LockContext = createContext<LockContextType | undefined>(undefined);

type LockProviderProps = {
    children: React.ReactNode;
    getter?: () => any; // Optional getter function
};

export const LockProvider = ({ children, getter }: LockProviderProps) => {
    const [isValid, setIsValid] = useState<boolean>(true);
    const { updateService } = services();
    const [lockedState, setLockedState] = useState(getter ? getter() : null);

    useEffect(() => {
        const handleUpdate: SiteUpdateHandler = async (isLocal) => {
            if (isLocal) {
                if (getter) {
                    setLockedState(getter());
                }
            } else {
                const stateChanged = !getter || getter() !== lockedState;
                if (stateChanged) {
                    setIsValid(false);
                }
            }
        };

        updateService.addUpdateHandler(handleUpdate);

        return () => {
            updateService.removeUpdateHandler(handleUpdate);
        };
    }, [getter, lockedState, updateService]);

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
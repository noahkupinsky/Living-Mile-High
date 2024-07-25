import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';

interface ResizeContextProps {
    width: number;
    height: number;
    hasDimensions: boolean;
    addResizeListener: (callback: () => void) => void;
    removeResizeListener: (callback: () => void) => void;
}

const ResizeContext = createContext<ResizeContextProps | undefined>(undefined);

export const ResizeProvider = ({ children }: { children: React.ReactNode }) => {
    const hasWindow = typeof window !== 'undefined';
    const [hasDimensions, setHasDimensions] = useState(hasWindow);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>(
        hasWindow ? {
            width: window.innerWidth,
            height: window.innerHeight,
        } : {
            width: 0,
            height: 0,
        }
    );

    const listeners = useRef<Set<() => void>>(new Set());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleResize = useCallback(
        debounce(() => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            setHasDimensions(true);
            listeners.current.forEach((callback) => callback());
        }, 100),
        []
    );

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    const addResizeListener = (callback: () => void) => {
        listeners.current.add(callback);
    };

    const removeResizeListener = (callback: () => void) => {
        listeners.current.delete(callback);
    };

    return (
        <ResizeContext.Provider
            value={{
                ...dimensions,
                hasDimensions,
                addResizeListener,
                removeResizeListener,
            }}
        >
            {children}
        </ResizeContext.Provider>
    );
};

export const useResize = (): ResizeContextProps => {
    const context = useContext(ResizeContext);
    if (context === undefined) {
        throw new Error('useResize must be used within a ResizeProvider');
    }
    return context;
};
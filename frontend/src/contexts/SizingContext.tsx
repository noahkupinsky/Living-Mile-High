'use client';

import { INNER_PADDING, OUTER_BORDER } from '@/config/constants';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type SizingContextType = {
    bodyRef: React.RefObject<HTMLDivElement>;
    headerRef: React.RefObject<HTMLDivElement>;
    footerRef: React.RefObject<HTMLDivElement>;
    bodyWidth: number;
    bodyHeight: number;
    sizingLoading: boolean;
};

export const SizingContext = createContext<SizingContextType | undefined>(undefined);

export const SizingProvider = ({ children }: { children: React.ReactNode }) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [sizingLoading, setSizingLoading] = useState(true);
    const [bodyWidth, setBodyWidth] = useState(0);
    const [bodyHeight, setBodyHeight] = useState(0);

    const handleResize = useCallback(() => {
        let actualBodyHeight: number | null = null;
        let effectiveBodyHeight: number | null = null;
        if (bodyRef.current) {
            setBodyWidth(bodyRef.current.offsetWidth);
            actualBodyHeight = bodyRef.current.offsetHeight;
        }

        if (headerRef.current && footerRef.current && window) {
            const headerHeight = headerRef.current.offsetHeight;
            const footerHeight = footerRef.current.offsetHeight;
            const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
            const windowHeight = Math.floor(smallerDimension * (100 - 2 * (INNER_PADDING + OUTER_BORDER)) / 100);
            effectiveBodyHeight = windowHeight - headerHeight - footerHeight;
        }

        if (actualBodyHeight && effectiveBodyHeight) {
            setBodyHeight(Math.min(actualBodyHeight, effectiveBodyHeight));
            setSizingLoading(false);
        }
    }, [bodyRef]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(handleResize);
        handleResize();

        if (bodyRef.current) {
            resizeObserver.observe(bodyRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [bodyRef, footerRef, headerRef, handleResize]);

    return (
        <SizingContext.Provider value={{
            bodyRef,
            headerRef,
            footerRef,
            bodyWidth,
            bodyHeight,
            sizingLoading
        }}>
            {children}
        </SizingContext.Provider>
    );
}

export const useSizing = (): SizingContextType => {
    const context = useContext(SizingContext);
    if (!context) {
        throw new Error('useBodyContext must be used within a BodyProvider');
    }
    return context;
};
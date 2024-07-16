'use client';

import React from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';

type LoadingComponentProps = {
    children: React.ReactNode;
}

const LoadingComponent = ({ children }: LoadingComponentProps) => {
    const { isLoading } = useSiteData();

    if (isLoading) {
        return (
            <div>
                <div className="spinner">Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
}

export default LoadingComponent;
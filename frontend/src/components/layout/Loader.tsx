'use client';

import React from 'react';

type LoaderProps = {
    children: React.ReactNode;
    isLoading: boolean;
}

const Loader = ({ isLoading, children }: LoaderProps) => {

    if (isLoading) {
        return (
            <div>
            </div>
        );
    }

    return <>{children}</>;
}

export default Loader;
'use client';

import React, { useEffect } from 'react';
import { useLock, LockProvider } from '@/contexts/LockContext';
import { useSiteData } from '@/contexts/SiteDataContext';

const ExampleComponent = () => {
    const { isValid, setIsValid } = useLock();
    const { generalData } = useSiteData();

    useEffect(() => {
        if (!isValid) {
            if (window.confirm("The data has changed, please reload the page to get the latest information.")) {
                window.location.reload();
            } else {
                setIsValid(true);
            }
        }
    }, [isValid, setIsValid]);

    if (!generalData) {
        return null;
    }

    return (
        <div>
            <h1>Example Component</h1>
            <p>{generalData.about.text}</p>
        </div>
    );
};

const ExamplePage = () => {
    const { generalData } = useSiteData();

    const getAboutText = () => {
        if (!generalData) {
            return "Couldn't load data";
        }

        const aboutText = generalData.about.text;
        return aboutText;
    };

    return (
        <LockProvider getter={getAboutText}>
            <ExampleComponent />
        </LockProvider>
    );
};

export default ExamplePage;
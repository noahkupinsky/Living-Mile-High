'use client';

import React, { useEffect } from 'react';
import { useLock, LockProvider } from '@/contexts/LockContext';
import { useSiteData } from '@/contexts/SiteDataContext';

const ExampleComponent = () => {
    const { isValid, setIsValid } = useLock();
    const { getGeneralData } = useSiteData();
    const generalData = getGeneralData();

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

const ExamplePage = ({ id }: { id?: string }) => {
    const { getGeneralData } = useSiteData();

    const getAboutText = () => {
        const generalData = getGeneralData();
        if (!generalData) {
            return null;
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
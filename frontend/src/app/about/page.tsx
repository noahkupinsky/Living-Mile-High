'use client';

import React from 'react';
import LoadingComponent from '@/components/LoadingComponent';
import { useSiteData } from '@/contexts/SiteDataContext';
import { AutoImage } from '@/components/images/AutoImage';

const AboutPage = () => {
    const { generalData } = useSiteData();

    if (!generalData) {
        return null;
    }

    const { text, image } = generalData.about;

    return (
        <LoadingComponent>
            <div>
                <h1>About Us</h1>
                <AutoImage src={image} alt="About Us" />
                <p>{text}</p>
            </div>
        </LoadingComponent>
    );
};

export default AboutPage;
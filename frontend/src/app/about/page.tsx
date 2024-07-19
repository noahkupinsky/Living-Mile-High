'use client';

import React from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { AutoImage } from '@/components/images/AutoImage';
import SiteDataLoader from '@/components/layout/SiteDataLoader';

const AboutPage = () => {
    const { generalData } = useSiteData();

    if (!generalData) {
        return null;
    }

    const { text, image } = generalData.about;

    return (
        <SiteDataLoader>
            <div>
                <h1>About Us</h1>
                <AutoImage src={image} alt="About Us" />
                <p>{text}</p>
            </div>
        </SiteDataLoader>
    );
};

export default AboutPage;
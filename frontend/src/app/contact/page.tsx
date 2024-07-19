'use client';

import React from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { AutoImage } from '@/components/images/AutoImage';
import SiteDataLoader from '@/components/layout/SiteDataLoader';

const ContactPage = () => {
    const { generalData } = useSiteData();

    if (!generalData) {
        return null;
    }

    const { text, image } = generalData.contact;

    return (
        <SiteDataLoader>
            <div>
                <h1>Contact Us</h1>
                <AutoImage src={image} alt="Contact Us" />
                <p>{text}</p>
            </div>
        </SiteDataLoader>
    );
};

export default ContactPage;
'use client';

import React from 'react';
import LoadingComponent from '@/components/LoadingComponent';
import { useSiteData } from '@/contexts/SiteDataContext';
import { AutoImage } from '@/components/ImageComponents';

const ContactPage = () => {
    const { getGeneralData } = useSiteData();
    const generalData = getGeneralData();

    if (!generalData) {
        return null;
    }

    const { text, image } = generalData.contact;

    return (
        <LoadingComponent>
            <div>
                <h1>Contact Us</h1>
                <AutoImage src={image} alt="Contact Us" />
                <p>{text}</p>
            </div>
        </LoadingComponent>
    );
};

export default ContactPage;
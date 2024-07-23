'use client';

import React from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { AutoImage } from '@/components/images/AutoImage';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { SPLIT_CHAR } from '@/config/constants';
import { styled, View, Text } from 'tamagui';

const LineContainer = styled(View, {
    width: '100%',
    alignItems: 'center',
    padding: '10px',
});

const Line = styled(Text, {
    width: '100%',
    textAlign: 'center',
    padding: '5px 0',
});

const ContactPage = () => {
    const { generalData } = useSiteData();

    if (!generalData) {
        return null;
    }

    const { text, image } = generalData.contact;
    const lines = text.split(SPLIT_CHAR).map(l => l.trim());


    return (
        <SiteDataLoader>
            <div>
                <h1>Contact Us</h1>
                <AutoImage src={image} alt="Contact Us" />

                <LineContainer>
                    {lines.map((l, index) => (
                        <Line key={index}>{l}</Line>
                    ))}
                </LineContainer>
            </div>
        </SiteDataLoader>
    );
};

export default ContactPage;
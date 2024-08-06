'use client';

import React, { useMemo } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { SPLIT_CHAR } from '@/config/constants';
import { styled, View, Text, YStack } from 'tamagui';
import ContactFormComponent from './ContactForm';
import { useSizing } from '@/contexts/SizingContext';
import AspectImage from '@/components/images/AspectImage';
import { minV } from '@/utils/misc';

const FORM_PERCENTAGE = 0.8;
const FORM_MAX_WIDTH = '80rem';

const IMAGE_PERCENTAGE = 0.5;

const ContactContainer = styled(YStack, {
    alignItems: 'center',
})

const FormContainer = styled(View, {
    width: '100%'
})

const ContactTextContainer = styled(YStack, {
    width: '100%',
    padding: '3rem',
})

const LineContainer = styled(View, {
    width: '100%',
    alignItems: 'center',
    paddingVertical: '0.2rem'
});

const Line = styled(Text, {
    width: '100%',
    fontSize: minV(1.8),
    fontFamily: '$sc',
    fontWeight: 500,
    color: '$darkGray',
    textAlign: 'center',
});

const ContactPageComponent = () => {
    const { bodyWidth, bodyHeight } = useSizing();
    const { generalData } = useSiteData();

    const formWidth = useMemo(() => bodyWidth * FORM_PERCENTAGE, [bodyWidth]);

    const imageWidth = useMemo(() => Math.min(bodyWidth, bodyHeight) * IMAGE_PERCENTAGE, [bodyHeight, bodyWidth]);

    if (!generalData) {
        return null;
    }

    const { text, image } = generalData.contact;
    const lines = text.split(SPLIT_CHAR).map(l => l.trim());


    return (
        <ContactContainer>
            <AspectImage width={imageWidth} src={image} alt="Contact Us" />
            <ContactTextContainer>
                {lines.map((l, index) => (
                    <LineContainer key={index}>
                        <Line>{l}</Line>
                    </LineContainer>
                ))}
            </ContactTextContainer>
            <FormContainer
                width={`min(${formWidth}px, ${FORM_MAX_WIDTH})`}
            >
                <ContactFormComponent />
            </FormContainer>
        </ContactContainer>

    );
};

const ContactPage = () => {
    return (
        <SiteDataLoader>
            <ContactPageComponent />
        </SiteDataLoader>
    );
}

export default ContactPage;
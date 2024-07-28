'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { FADE_MEDIUM } from '@/config/constants';
import { styled, View, Text, XStack, YStack } from 'tamagui';
import { useSizing } from '@/contexts/SizingContext';
import AspectImage from '@/components/images/AspectImage';
import { minV, requestAnimationFrames } from '@/utils/misc';

const IMAGE_PERCENTAGE = 0.6;
const BODY_HEIGHT_PERCENTAGE = 0.9;

const TEXT_WIDTH_PERCENTAGE = 0.25;
const TEXT_HEIGHT_PERCENTAGE = 0.8;
const FONT_PERCENTAGE = 0.05;

const AboutContainer = styled(XStack, {
    alignItems: 'center',
    justifyContent: 'flex-start',
})

const AboutTextContainer = styled(YStack, {
    backgroundColor: '$lightBg',
    padding: '8%',
    paddingTop: '20%',
    justifyContent: 'flex-start',
    style: {
        transition: FADE_MEDIUM,
    }
})

const AboutTextBorder = styled(View, {
    alignItems: 'center',
    padding: minV(3)
})

const AboutText = styled(Text, {
    width: '100%',
    fontFamily: '$form',
    color: '$darkGray',
    textAlign: 'left',
});

const ContactPageComponent = () => {
    const { bodyWidth, bodyHeight } = useSizing();
    const { generalData } = useSiteData();
    const [textHeight, setTextHeight] = useState(0);
    const [textOpacity, setTextOpacity] = useState(0);

    const textWidth = useMemo(() => bodyWidth * TEXT_WIDTH_PERCENTAGE, [bodyWidth]);

    const maxHeight = useMemo(() => bodyHeight * BODY_HEIGHT_PERCENTAGE, [bodyHeight]);

    const imageWidth = useMemo(() => Math.min(bodyWidth, bodyHeight) * IMAGE_PERCENTAGE, [bodyHeight, bodyWidth]);

    const fontSize = useMemo(() => Math.min(textWidth, textHeight) * FONT_PERCENTAGE, [textWidth, textHeight]);

    const { text, image } = generalData!.about;

    const handleDimensions = useCallback(({ width, height }: { width: number, height: number }) => {
        if (height > 0) {
            setTextHeight(height * TEXT_HEIGHT_PERCENTAGE);
            requestAnimationFrames(() => {
                setTextOpacity(1);
            });
        }
    }, []);

    return (
        <AboutContainer>
            <AspectImage
                width={imageWidth}
                height={maxHeight}
                src={image}
                onDimensions={handleDimensions}
                alt="about Us" />
            <AboutTextBorder>
                <AboutTextContainer
                    width={textWidth}
                    height={textHeight}
                    opacity={textOpacity}
                >
                    <AboutText fontSize={fontSize}>{text}</AboutText>
                </AboutTextContainer>
            </AboutTextBorder>
        </AboutContainer>

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
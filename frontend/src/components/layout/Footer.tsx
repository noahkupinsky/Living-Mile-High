"use client"

import { Text, XStack, YStack, styled } from 'tamagui';
import { EMAIL_ADDRESS, FADE_SHORT, PHONE_NUMBER } from '@/config/constants';
import { useMemo } from 'react';
import { HeaderFooterHorizontalLine } from './LayoutComponents';
import useFadeIn from '@/utils/fadeIn';
import { useSizing } from '@/contexts/SizingContext';

const MAX_FONT_SIZE = 13;
const FONT_PERCENTAGE = 0.02;

const FooterContainer = styled(YStack, {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    style: {
        transition: FADE_SHORT,
    }
});
const FooterTextContainer = styled(XStack, {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '4%'
})
const FooterText = styled(Text, {
    fontFamily: '$caps',
    letterSpacing: '$2',
    color: '$lightGray',
    fontWeight: 600,
});

export default function Footer() {
    const { bodyWidth, footerRef } = useSizing();
    const opacity = useFadeIn();

    const fontSize = useMemo(() => Math.min(bodyWidth * FONT_PERCENTAGE, MAX_FONT_SIZE), [bodyWidth]);

    return (
        <FooterContainer
            ref={footerRef}
            opacity={opacity}
        >
            <HeaderFooterHorizontalLine />
            <FooterTextContainer>
                <FooterText
                    fontSize={`${fontSize}px`}>
                    {`${PHONE_NUMBER} | ${EMAIL_ADDRESS}`}
                </FooterText>
            </FooterTextContainer>
        </FooterContainer>
    );
}
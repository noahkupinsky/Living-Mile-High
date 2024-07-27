"use client"

import { Text, XStack, YStack, styled } from 'tamagui';
import HorizontalLine from './HorizontalLine';
import { EMAIL_ADDRESS, FADE_SHORT, PHONE_NUMBER } from '@/config/constants';
import { useEffect, useState } from 'react';
import { HeaderFooterHorizontalLine } from './LayoutComponents';
import useFadeIn from '@/utils/fadeIn';
import { useSizing } from '@/contexts/SizingContext';

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
    paddingLeft: '5%'
})
const FooterText = styled(Text, {
    fontFamily: '$caps',
    fontSize: '$2',
    letterSpacing: '$2',
    color: '$darkGray',
});

export default function Footer() {
    const { footerRef } = useSizing();
    const opacity = useFadeIn();

    return (
        <FooterContainer
            ref={footerRef}
            opacity={opacity}
        >
            <HeaderFooterHorizontalLine />
            <FooterTextContainer>
                <FooterText>{`${PHONE_NUMBER} | ${EMAIL_ADDRESS}`}</FooterText>
            </FooterTextContainer>
        </FooterContainer>
    );
}
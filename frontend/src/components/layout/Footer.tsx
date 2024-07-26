"use client"

import { Text, XStack, YStack, styled } from 'tamagui';
import HorizontalLine from './HorizontalLine';
import { EMAIL_ADDRESS, PHONE_NUMBER } from '@/config/constants';
import { useResize } from '@/contexts/ResizeContext';
import { useEffect, useState } from 'react';

const FooterContainer = styled(YStack, {
    width: '100%',
    paddingBottom: '2vh',
    alignItems: 'center',
    justifyContent: 'center',
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <FooterContainer
            opacity={isMounted ? 1 : 0}
            style={{
                transition: 'opacity 0.1s ease-in-out',
            }}
        >
            <HorizontalLine width={'95%'} height={'5rem'} color={'$darkGray'} />
            <FooterTextContainer>
                <FooterText>{`${PHONE_NUMBER} | ${EMAIL_ADDRESS}`}</FooterText>
            </FooterTextContainer>
        </FooterContainer>
    );
}
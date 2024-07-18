"use client"

import { Text, View, styled } from 'tamagui';

const FooterView = styled(View, {
    name: 'FooterView',
    width: '100%',
    padding: '$sm',
    backgroundColor: '$background',
    alignItems: 'center',
    justifyContent: 'center',
});

const FooterText = styled(Text, {
    name: 'FooterText',
    fontSize: '$md',
});

export default function Footer() {
    return (
        <FooterView>
            <FooterText>Footer</FooterText>
        </FooterView>
    );
}
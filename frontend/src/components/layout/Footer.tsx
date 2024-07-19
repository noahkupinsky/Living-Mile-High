"use client"

import { Text, View, styled } from 'tamagui';
import NavTabsComponent from './NavTabsComponent';

const FooterView = styled(View, {
    name: 'FooterView',
    width: '100%',
    padding: '$sm',
    backgroundColor: '$background',
    alignItems: 'center',
    justifyContent: 'center',
});

export default function Footer() {
    return (
        <FooterView>
            <NavTabsComponent includeHome={true} />
        </FooterView>
    );
}
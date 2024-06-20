"use client"

import { Text, View, styled } from 'tamagui';

const HeaderView = styled(View, {
    name: 'HeaderView',
    width: '100%',
    padding: '$sm',
    backgroundColor: '$background',
    alignItems: 'center',
    justifyContent: 'center',
});

const HeaderText = styled(Text, {
    name: 'HeaderText',
    fontSize: '$lg',
    fontWeight: 'bold',
});

export default function Header() {
    return (
        <HeaderView>
            <HeaderText>Header</HeaderText>
        </HeaderView>
    );
}
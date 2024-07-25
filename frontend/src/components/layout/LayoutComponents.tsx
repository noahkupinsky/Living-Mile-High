"use client"

import { View, styled } from "tamagui";

export const BorderWrapper = styled(View, {
    padding: '2%',
    name: 'Border',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    backgroundColor: '$siteBorderColor',
});

export const SiteContent = styled(View, {
    name: 'SiteContent',
    flex: 1,
    backgroundColor: '$whiteBg',
})

export const Body = styled(View, {
    name: 'Main',
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '$whiteBg'
});

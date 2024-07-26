"use client"

import { MAX_WIDTH } from "@/config/constants";
import { View, YStack, styled } from "tamagui";

export const BorderWrapper = styled(View, {
    padding: '2vh',
    name: 'Border',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    backgroundColor: '$siteBorderColor',
});

export const Background = styled(YStack, {
    name: 'SiteContent',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '$whiteBg',
})

export const MaxWidthEnforcer = styled(YStack, {
    name: 'MaxWidthEnforcer',
    maxWidth: MAX_WIDTH,
    width: '100%',
    flex: 1,
})

export const Body = styled(View, {
    name: 'Main',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '$whiteBg'
});

"use client"

import { INNER_PADDING, MAX_WIDTH, OUTER_BORDER } from "@/config/constants";
import { View, YStack, styled } from "tamagui";
import HorizontalLine from "./HorizontalLine";

export const BorderWrapper = styled(View, {
    padding: `${OUTER_BORDER}vh`,
    name: 'Border',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    backgroundColor: '$lightBg',
});

export const Background = styled(YStack, {
    name: 'SiteContent',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '$whiteBg',
})

export const MaxWidthEnforcer = styled(YStack, {
    name: 'MaxWidthEnforcer',
    maxWidth: `${MAX_WIDTH}rem`,
    width: '100%',
    padding: `${INNER_PADDING}vh`,
    flex: 1,
})

export const HeaderFooterHorizontalLine = () =>
    (<HorizontalLine width={'97%'} height={'4vh'} color={'$darkGray'} />);

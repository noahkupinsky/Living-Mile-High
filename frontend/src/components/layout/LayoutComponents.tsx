"use client"

import { View, styled } from "tamagui";

export const Container = styled(View, {
    name: 'Container',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

export const Main = styled(View, {
    name: 'Main',
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',

});

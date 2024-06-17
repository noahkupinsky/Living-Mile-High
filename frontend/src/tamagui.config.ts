import { tokens as defaultTokens } from '@tamagui/themes';
import { createTamagui, createTokens } from 'tamagui'

//@ts-ignore
const tokens = createTokens({
    ...defaultTokens,
    color: {
        black: '#000000',
        white: '#FFFFFF',
        lightGray: '#D9D9D9',
        darkGray: '#707070',
    },
});

const lightTheme = {
    background: tokens.color.white,
    text: tokens.color.black,
    primary: tokens.color.darkGray,
    secondary: tokens.color.lightGray,
}

const darkTheme = {
    background: tokens.color.black,
    text: tokens.color.white,
    primary: tokens.color.lightGray,
    secondary: tokens.color.darkGray,
}

const config = createTamagui({
    themes: {
        light: lightTheme,
        dark: darkTheme,
    },
    tokens,
    shorthands: {},
})

export default config
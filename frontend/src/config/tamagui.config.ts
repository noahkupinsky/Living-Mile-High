import { tokens as defaultTokens } from '@tamagui/themes';
import { createTamagui, createTokens } from 'tamagui'
import { config as defaultConfig } from '@tamagui/config/v3'

//@ts-ignore
const tokens = createTokens({
    ...defaultTokens,
    //@ts-ignore
    color: {
        white: '#fff',
        black: '#000',
        light_gray: '#999',
        dark_gray: '#333',
    },
});

const lightTheme = {
    background: tokens.color.white,
    text: tokens.color.dark_gray,
    primary: tokens.color.black,
    color: tokens.color.dark_gray,
}

const darkTheme = {
    background: tokens.color.black,
    text: tokens.color.light_gray,
    primary: tokens.color.white,
    color: tokens.color.light_gray,
}

// @ts-ignore
const config = createTamagui({
    ...defaultConfig,
    themes: {
        light: lightTheme,
        dark: darkTheme,
    },
    tokens,
    shorthands: {},
})

//const config = createTamagui(defaultConfig);

export default config
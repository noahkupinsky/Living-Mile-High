import { tokens } from '@tamagui/themes'
import { createTamagui } from 'tamagui'

const lightTheme = {
    background: 'FFFFFF',
    text: '000000',
    primary: 'FFFFFF',
    secondary: '000000',
}

const darkTheme = {
    background: '000000',
    text: 'FFFFFF',
    primary: '000000',
    secondary: 'FFFFFF',
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
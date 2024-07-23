import { config } from '@tamagui/config/v3'
import { createTamagui, createTokens } from 'tamagui' // or '@tamagui/core'

export const tokens = createTokens({
    ...config.tokens,
    color: {
        lightGray: '#999999',
        darkGray: '#333333',
        white: '#ffffff',
        blackGray: '#111111',
    },
})

const appConfig: any = createTamagui({
    ...config as any,
    tokens,
    themes: {
        light: {
            ...config.themes.light_active,
            text: tokens.color.blackGray,
            mildText: tokens.color.lightGray,
        },
    },
});

export type AppConfig = typeof appConfig

export default appConfig

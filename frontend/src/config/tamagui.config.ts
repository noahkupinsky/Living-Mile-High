import { config } from '@tamagui/config/v3'
import { createFont, createTamagui, createTokens } from 'tamagui' // or '@tamagui/core'

export const tokens = createTokens({
    ...config.tokens,
    color: {
        lightGray: '#999999',
        darkGray: '#333333',
        whiteBg: '#fff',
        siteBorderColor: '#eee',
    },
});

export const garetFont = createFont({
    family: 'Garet',
    size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
    },
    lineHeight: {
        1: 1.2,
        2: 1.5,
        3: 1.8,
    },
    letterSpacing: {
        1: 0,
        2: 0.5,
        3: 1,
    },
});

export const coutureFont = createFont({
    family: 'Couture',
    size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
    },
    lineHeight: {
        1: 1.2,
        2: 1.5,
        3: 1.8,
    },
    letterSpacing: {
        1: 1,
        2: 1.5,
        3: 2.5,
        4: 3.5,
        5: 5,
    },
})

const appConfig: any = createTamagui({
    ...config as any,
    tokens,
    fonts: {
        ...config.fonts,
        caps: coutureFont,
    }
});

export type AppConfig = typeof appConfig

export default appConfig

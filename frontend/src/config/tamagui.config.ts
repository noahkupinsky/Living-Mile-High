import { config } from '@tamagui/config/v3'
import { createFont, createTamagui, createTokens } from 'tamagui' // or '@tamagui/core'

export const tokens = createTokens({
    ...config.tokens as any,
    color: {
        lightGray: '#d0d0d0',
        darkGray: '#666666',
        whiteBg: '#f9f9f9',
        lightBg: '#e3e3e3',
        black: '#000000',
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

export const ysabeauSCFont = createFont({
    family: 'YsabeauSC',
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
})

const appConfig: any = createTamagui({
    ...config as any,
    tokens,
    fonts: {
        ...config.fonts,
        form: garetFont,
        sc: ysabeauSCFont
    }
});

export type AppConfig = typeof appConfig

export default appConfig

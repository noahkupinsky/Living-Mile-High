import { config } from '@tamagui/config/v3'
import { createTamagui, createTokens } from 'tamagui' // or '@tamagui/core'

export const tokens = createTokens({
    ...config.tokens,
    color: {
        lightGray: '#999999',
        darkGray: '#333333',
        whiteBg: '#fff',
        siteBorderColor: '#eee',
    },
})

const appConfig: any = createTamagui({
    ...config as any,
    tokens,
});

export type AppConfig = typeof appConfig

export default appConfig

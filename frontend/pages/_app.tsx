/* eslint-disable react-hooks/exhaustive-deps */
import '@/styles/globals.css';
import '@tamagui/core/reset.css'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useMemo } from 'react'
import tamaguiConfig from '../src/tamagui.config'
import { TamaguiProvider } from 'tamagui';
import Header from '../src/components/Header';

type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
    interface TamaguiCustomConfig extends Conf { }
}

export default function App({ Component, pageProps }: AppProps) {
    const [theme, setTheme] = useRootTheme()
    const contents = useMemo(() => {
        return <Component {...pageProps} />
    }, [pageProps])
    return (
        <>
            <Head>
                <title>Your page title</title>
                <meta name="description" content="Your page description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NextThemeProvider
                defaultTheme="light"
                onChangeTheme={setTheme as any}
            >
                <TamaguiProvider
                    config={tamaguiConfig}
                    disableInjectCSS
                    disableRootThemeClass
                    defaultTheme={theme}
                >
                    <Header />
                    {contents}
                </TamaguiProvider>
            </NextThemeProvider>
        </>
    )
}

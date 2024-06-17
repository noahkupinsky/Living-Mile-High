/* eslint-disable react-hooks/exhaustive-deps */
import '@/styles/globals.css';
import '@tamagui/core/reset.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useMemo } from 'react'
import tamaguiConfig from '../src/tamagui.config'
import Header from '../src/components/Header';
import Providers from '@/providers/providers';

type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
    interface TamaguiCustomConfig extends Conf { }
}

export default function App({ Component, pageProps }: AppProps) {
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

            <Providers>
                <Header />
                {contents}
            </Providers>
        </>
    )
}

import React from 'react';
import Providers from '@/providers';
import { PublicEnvScript } from 'next-runtime-env';
import { BorderWrapper, Background, MaxWidthEnforcer } from '@/components/layout/LayoutComponents';
import Body from '@/components/layout/Body';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/Footer';
import BonusFeatures from '@/components/bonus/BonusFeatures';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>Living Mile High</title>
        <meta name="description" content="LMH Development website" />


        <link rel="icon" href="/favicon.ico" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <PublicEnvScript />
      </head>
      <body>
        <Providers>
          <BorderWrapper>
            <Background>
              <MaxWidthEnforcer>
                <Header />
                <Body>
                  {children}
                </Body>
                <Footer />
                <BonusFeatures />
              </MaxWidthEnforcer>
            </Background>
          </BorderWrapper>
        </Providers>
      </body>
    </html>
  )
}

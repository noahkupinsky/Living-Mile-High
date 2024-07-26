import React from 'react';
import Providers from '@/providers';
import { PublicEnvScript } from 'next-runtime-env';
import { BorderWrapper, SiteContent, Body } from '@/components/layout/LayoutComponents';
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
        <PublicEnvScript />
      </head>
      <body>
        <Providers>
          <BorderWrapper>
            <SiteContent>
              <Header />
              <Body>
                {children}
              </Body>
              <Footer />
              <BonusFeatures />
            </SiteContent>
          </BorderWrapper>
        </Providers>
      </body>
    </html>
  )
}

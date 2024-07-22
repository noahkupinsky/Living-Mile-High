import React from 'react';
import Providers from '@/providers';
import { PublicEnvScript } from 'next-runtime-env';
import { Container, Main } from '@/components/layout/LayoutComponents';
import Header from '@/components/layout/Header';
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
          <Container>
            <Header />
            <Main>
              {children}
            </Main>
            <Footer />
            <BonusFeatures />
          </Container>
        </Providers>
      </body>
    </html>
  )
}

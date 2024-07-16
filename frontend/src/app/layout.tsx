import React from 'react';
import Providers from '@/providers';
import Header from '@/components/HeaderComplex';
import { PublicEnvScript } from 'next-runtime-env';
import Footer from '@/components/Footer';
import { Container, Main } from '@/components/LayoutComponents';

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
          </Container>
        </Providers>
      </body>
    </html>
  )
}

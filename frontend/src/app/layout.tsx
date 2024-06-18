import React from 'react';
import { Metadata } from 'next';
import Providers from '@/providers/providers';
import Header from '@/components/Header';
import { PublicEnvScript } from 'next-runtime-env';

export const metadata: Metadata = {
  title: 'Living Mile High',
  description: 'LMH Development website',
  icons: '/favicon.ico',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}

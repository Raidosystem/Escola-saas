import '../styles/globals.css';
import { Sidebar } from '@components/layout/Sidebar';
import Providers from './providers';
import React from 'react';
import { headers } from 'next/headers';

export const metadata = { title: 'SME SaaS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
      </head>
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import '../styles/globals.css';
import { Sidebar } from '@components/layout/Sidebar';
import Providers from './providers'; // TS NodeNext may require extension; keeping as is for Next transpilation
import React from 'react';

export const metadata = { title: 'SME SaaS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
      </head>
      <body className="min-h-screen flex">
        <Providers>
          <Sidebar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').then(reg=>{navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='NEW_VERSION'){console.log('New version',e.data.version);location.reload();}});if(reg.waiting){location.reload();}}).catch(()=>{});});navigator.serviceWorker.addEventListener('controllerchange',()=>{console.log('SW controller change -> reload');});}`,
          }}
        />
      </body>
    </html>
  );
}

import '@/styles/globals.css';

import { Work_Sans } from 'next/font/google';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { TRPCReactProvider } from '@/trpc/react';
import Navbar from './_components/navbar/NavbarWrapper';
import MessagePopup from './_components/ui/MessagePopup';

export const metadata: Metadata = {
  title: 'Dungeoneer',
  description: 'FFXIV Tracker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const worksans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'], // Add specific weights if needed
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={worksans.className}>
      <body>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <div
              style={{ backgroundImage: "url('/bg.jpg')" }}
              className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat text-stone-800 dark:text-stone-200">
              <Navbar />
              <MessagePopup />
              <main
                role="main"
                className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-stone-200/90 to-stone-800/40 px-4 pb-10 pt-20 dark:from-stone-950 dark:via-stone-900/95 dark:to-stone-900/60 xl:px-32">
                {children}
              </main>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

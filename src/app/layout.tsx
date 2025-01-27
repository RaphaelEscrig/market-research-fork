import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.scss';
import AppWrapper from '@/modules/app/react/components/app-wrapper.component';
import { Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const openSans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Linkup - Market research',
  description: 'Example of a market research website powered by Linkup',
  openGraph: {
    title: 'Linkup - Market research',
    description: 'Example of a market research website powered by Linkup',
    url: 'http://mr.linkup.so',
    images: [
      {
        url: 'https://app.linkup.so/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'linkup market research preview',
      },
    ],
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${openSans.className} whitespace-pre-line antialiased`}>
        <AppWrapper>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </AppWrapper>
      </body>
    </html>
  );
}

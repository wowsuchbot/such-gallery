// such.gallery - Root layout

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'such.gallery — curated NFTs from cryptoart.social',
  description: 'Browse and curate NFTs from cryptoart.social. Curators and artists make money.',
  openGraph: {
    title: 'such.gallery',
    description: 'Curated NFTs from cryptoart.social',
    url: 'https://such.gallery',
    siteName: 'such.gallery',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'such.gallery',
    description: 'Curated NFTs from cryptoart.social',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

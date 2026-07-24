import type { Metadata, Viewport } from 'next';
import { Mulish, Geist } from 'next/font/google';
import './globals.css';
import { siteConfig, generateSoftwareApplicationSchema, SITE_URL } from '../lib/seo';
import { JsonLd } from '../components/seo/JsonLd';

const mulish = Mulish({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-mulish',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@polotno',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdData = generateSoftwareApplicationSchema();

  return (
    <html lang="ru" className={`${mulish.variable} ${geist.variable} h-full antialiased`}>
      <head>
        <JsonLd data={jsonLdData} />
      </head>
      <body className={`${mulish.className} min-h-full flex flex-col overflow-hidden bg-neutral-100`}>
        {children}
      </body>
    </html>
  );
}

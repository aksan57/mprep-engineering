import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import Shell, { SIDEBAR_BOOT } from '@/components/Shell';
import { BRAND, OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/data/site';
import './globals.css';

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-plex-sans', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });
const archivo = Archivo({ subsets: ['latin'], weight: ['800'], variable: '--font-archivo', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s — ${BRAND}` },
  description: SITE_DESCRIPTION,
  applicationName: BRAND,
  alternates: { canonical: '/' },
  icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
  openGraph: { type: 'website', siteName: BRAND, title: SITE_TITLE, description: SITE_DESCRIPTION, locale: 'en_US', url: '/', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESCRIPTION, images: [OG_IMAGE.url] },
};

export const viewport: Viewport = { themeColor: '#102A43', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} ${archivo.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SIDEBAR_BOOT }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

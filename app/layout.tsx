import type { Metadata } from 'next';
import { Jost, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import { SITE, SITE_URL } from '@/lib/site';

// Century Gothic is a licensed Monotype face with no free webfont
// distribution. Jost is a metrically close, freely-licensed geometric
// sans — it's the actual rendered font, with 'Century Gothic' listed
// first in the CSS stack so visitors who have it installed locally
// (common on Windows/Office machines) get the real thing.
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plexmono',
  weight: ['400', '500'],
  display: 'swap',
});

const TITLE = `${SITE.name} — Planning, Design & CRZ Approvals`;

export const metadata: Metadata = {
  // Resolves every relative OG/canonical URL below, and on the child pages.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'architect Mumbai',
    'CRZ approval consultant',
    'Coastal Regulation Zone clearance',
    'architectural consultant Borivali',
    'master planning Mumbai',
    'residential tower architect',
    'industrial layout design',
    'interior design Mumbai',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: TITLE,
    description: SITE.description,
    url: '/',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${plexMono.variable}`}>
      <body className="font-sans">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

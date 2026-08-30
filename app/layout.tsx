import type { Metadata } from 'next';
import { Jost, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

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

export const metadata: Metadata = {
  title: 'We Design Architects — Planning, Design & CRZ Approvals',
  description:
    'A Mumbai-based studio specialising in planning, design and CRZ approvals — from high-end residential towers to sprawling commercial and industrial layouts.',
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

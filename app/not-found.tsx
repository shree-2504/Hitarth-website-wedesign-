import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContourBackdrop from '@/components/ContourBackdrop';
import GrainOverlay from '@/components/GrainOverlay';
import NotFoundContent from '@/components/NotFoundContent';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * The root not-found boundary, hit by any URL matching no route at all — a
 * typo, a stale link from an email, an old path from a previous site. These
 * never enter the (site) route group, so without this they rendered Next's
 * stock 404 with no header, no footer and no way back into the site.
 *
 * The chrome is assembled here rather than inherited. ScrollReveals is
 * deliberately left out: nothing on this page uses the reveal classes, and it
 * must never depend on an animation to become visible.
 */
export default function RootNotFound() {
  return (
    <>
      <ContourBackdrop />
      <GrainOverlay />
      <Header />
      <main id="main">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}

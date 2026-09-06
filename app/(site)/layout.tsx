import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveals from '@/components/ScrollReveals';
import ContourBackdrop from '@/components/ContourBackdrop';
import GrainOverlay from '@/components/GrainOverlay';

// Shared chrome for every public-facing page (home, /work, /work/[slug], ...).
// Scoped to this route group so it never wraps the Sanity Studio at /studio,
// which needs full control of its own screen.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContourBackdrop />
      <ScrollReveals />
      <GrainOverlay />
      <Header />
      {children}
      <Footer />
    </>
  );
}

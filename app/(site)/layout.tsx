import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveals from '@/components/ScrollReveals';
import ContourBackdrop from '@/components/ContourBackdrop';
import GrainOverlay from '@/components/GrainOverlay';
import { localBusinessJsonLd } from '@/lib/site';

// Shared chrome for every public-facing page (home, /work, /work/[slug], ...).
// Scoped to this route group so it never wraps the Sanity Studio at /studio,
// which needs full control of its own screen.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Local-business structured data: this is what puts the studio in
          Google's local results for "CRZ approval" / "architect Mumbai". */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-ink focus:text-paper focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a>
      <ContourBackdrop />
      <ScrollReveals />
      <GrainOverlay />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

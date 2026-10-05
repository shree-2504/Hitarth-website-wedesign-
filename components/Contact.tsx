import MagneticLink from './MagneticLink';
import EmailStudioModal from './EmailStudioModal';
import { SITE, MAPS_URL } from '@/lib/site';

export default function Contact() {
  return (
    <section id="contact" className="bg-ink text-paper py-28 md:py-[130px] text-center relative">
      <div className="max-w-[720px] mx-auto px-6 md:px-10 relative">
        <div
          className="eyebrow reveal justify-center mb-5"
          style={{ '--eyebrow-color': '#8A99A0' } as React.CSSProperties}
        >
          Start a project
        </div>
        {/* The true logo red, not the deepened one the footer needs. At this
            size it counts as large text, where the bar is 3:1 — it measures
            4.48:1 on the ink ground, so the brand red works here unmodified. */}
        <h2 className="reveal font-display font-medium leading-[1.15] text-[clamp(32px,4.6vw,58px)]">
          Design. Approvals.{' '}
          <em className="not-italic md:italic" style={{ color: '#E31E24' }}>
            Realisation.
          </em>
        </h2>
        <p className="reveal mt-5 text-[#AFAEAC] text-base leading-relaxed">
          From first sketch to CRZ sign-off — tell us about your site and we&apos;ll take it from
          there.
        </p>
        <div className="reveal mt-11 flex gap-6 justify-center flex-wrap">
          <EmailStudioModal />
          <MagneticLink
            href={`tel:${SITE.phoneHref}`}
            className="border border-[#6E6F71] hover:border-paper transition-colors px-7 py-4 font-mono text-[13px] tracking-wide uppercase"
          >
            Call {SITE.phone}
          </MagneticLink>
        </div>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal mt-9 inline-block font-mono text-[13px] tracking-wide uppercase text-[#AFAEAC] border-b border-transparent hover:border-paper hover:text-paper transition-colors"
        >
          {SITE.address.full} ↗
        </a>
      </div>
    </section>
  );
}

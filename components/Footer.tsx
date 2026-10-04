import { SITE, MAPS_URL, NAV_LINKS } from '@/lib/site';

const linkClass =
  'font-mono text-xs uppercase tracking-wide text-muted hover:text-ink transition-colors';

export default function Footer() {
  return (
    <footer className="py-14 pb-10">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 border-t border-line pt-9">
        <div className="grid gap-10 md:grid-cols-[auto_1fr_auto] md:gap-16">
          <a href="/#top" className="flex flex-col items-center leading-none select-none self-start">
            <span className="font-display font-extrabold text-[19px] tracking-tight">
              <span style={{ color: '#E31E24' }}>W</span>
              <span style={{ color: '#58595B' }}>e</span>{' '}
              <span style={{ color: '#E31E24' }}>D</span>
              <span style={{ color: '#58595B' }}>
                es
                <span className="relative inline-block leading-none">
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -translate-x-1/2 top-[1px] w-[4px] h-[4px]"
                    style={{ backgroundColor: '#E31E24' }}
                  />
                  ı
                </span>
                gn
              </span>
            </span>
            <span className="w-full h-[2px] bg-[#58595B] mt-[2px]" />
            <span className="mt-[2px] font-sans text-[9px] tracking-wide" style={{ color: '#58595B' }}>
              {SITE.tagline}
            </span>
          </a>

          <nav aria-label="Footer" className="flex gap-8 flex-wrap md:justify-center h-fit">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className={linkClass}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Every previous version of this footer dead-ended on an address
              with nothing to act on — phone and email are the two things a
              prospective client actually wants at the bottom of the page. */}
          <div className="flex flex-col gap-2 md:items-end md:text-right">
            <a href={`tel:${SITE.phoneHref}`} className={linkClass}>
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className={linkClass}>
              {SITE.email}
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {SITE.address.full} ↗
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-line font-mono text-[11px] text-muted">
          © {new Date().getFullYear()} {SITE.name}. Planning · Design · CRZ Approvals.
        </div>
      </div>
    </footer>
  );
}

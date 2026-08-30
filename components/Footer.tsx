export default function Footer() {
  return (
    <footer className="py-14 pb-10">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 flex justify-between items-end flex-wrap gap-6 border-t border-line pt-9">
        <a href="/#top" className="flex flex-col items-center leading-none select-none">
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
            Architectural consultant
          </span>
        </a>
        <div className="flex gap-8 flex-wrap">
          {[
            { label: 'Studio', href: '/#studio' },
            { label: 'Practice', href: '/#practice' },
            { label: 'Interiors', href: '/interiors' },
            { label: 'Work', href: '/work' },
            { label: 'Contact', href: '/#contact' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono text-xs uppercase tracking-wide text-muted hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="font-mono text-xs text-muted text-right">
          <div>Borivali (W), Mumbai, Maharashtra</div>
          <div className="mt-1">
            © {new Date().getFullYear()} We Design Architects. Planning · Design · CRZ Approvals.
          </div>
        </div>
      </div>
    </footer>
  );
}

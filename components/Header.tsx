'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MagneticLink from './MagneticLink';

const LINKS = [
  { href: '/#studio', label: 'Studio' },
  { href: '/#practice', label: 'Practice' },
  { href: '/interiors', label: 'Interiors' },
  { href: '/work', label: 'Work' },
  { href: '/#contact', label: 'Contact' },
];

// Routes that open on a full-bleed dark image, where ink nav and an ink logo
// would be close to invisible until the header docks. Only the home page does
// this — every other page starts on paper, so the header keeps its ink.
const DARK_HERO_ROUTES = ['/'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on route change — the links are hash/route anchors
  // and the panel would otherwise stay open over the new page.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    // Lenis drives scrolling, so plain overflow:hidden isn't enough to stop
    // the page moving behind the open panel.
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis?.start();
    };
  }, [menuOpen]);

  // Over the dark hero the ink nav/logo are near-invisible (#101211 text on a
  // near-black photo), so flip the whole header to paper until it docks.
  const overHero = DARK_HERO_ROUTES.includes(pathname) && !scrolled && !menuOpen;
  const logoInk = overHero ? '#F4EDE0' : '#58595B';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] h-[76px] flex items-center transition-colors duration-300 border-b ${
        scrolled || menuOpen ? 'bg-paper/90 backdrop-blur-md border-line' : 'border-transparent'
      } ${overHero ? 'text-[#F4EDE0]' : 'text-ink'}`}
    >
      <div className="w-full max-w-[1240px] mx-auto px-6 md:px-10 flex items-center justify-between">
        <a href="/#top" className="flex flex-col items-center leading-none select-none">
          <span className="font-display font-extrabold text-[24px] tracking-tight">
            <span style={{ color: '#E31E24' }}>W</span>
            <span style={{ color: logoInk }}>e</span>{' '}
            <span style={{ color: '#E31E24' }}>D</span>
            <span style={{ color: logoInk }}>
              es
              <span className="relative inline-block leading-none">
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 -translate-x-1/2 top-[1px] w-[5px] h-[5px]"
                  style={{ backgroundColor: '#E31E24' }}
                />
                ı
              </span>
              gn
            </span>
          </span>
          <span
            className="w-full h-[2px] mt-[3px] transition-colors duration-300"
            style={{ backgroundColor: logoInk }}
          />
          <span
            className="mt-[3px] font-sans text-[10px] tracking-wide transition-colors duration-300"
            style={{ color: logoInk }}
          >
            Architectural consultant
          </span>
        </a>

        <nav className="hidden md:flex gap-10">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] tracking-wide uppercase font-mono relative pb-1 group"
            >
              {l.label}
              <span
                className={`absolute left-0 bottom-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                  overHero ? 'bg-[#F4EDE0]' : 'bg-accent'
                }`}
              />
            </a>
          ))}
        </nav>

        <MagneticLink
          href="/#contact"
          className={`hidden md:inline-flex border px-5 py-2.5 text-xs font-mono tracking-wide uppercase transition-colors ${
            overHero
              ? 'border-[#F4EDE0] hover:bg-[#F4EDE0] hover:text-ink'
              : 'border-ink hover:bg-ink hover:text-paper'
          }`}
        >
          Start a project
        </MagneticLink>

        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden flex flex-col gap-1.5 p-1.5"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="w-6 h-px bg-current block" />
          <span className="w-6 h-px bg-current block" />
          <span className="w-6 h-px bg-current block" />
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-[76px] left-0 right-0 bg-paper border-b border-line flex flex-col gap-5 p-6 text-ink"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-sm uppercase"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-1 self-start border border-ink px-5 py-3 font-mono text-xs tracking-wide uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            Start a project
          </a>
          <a
            href="tel:+919324270864"
            className="font-mono text-xs tracking-wide uppercase text-muted"
          >
            +91 93242 70864
          </a>
        </div>
      )}
    </header>
  );
}

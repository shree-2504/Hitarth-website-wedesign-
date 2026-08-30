'use client';

import { useEffect, useState } from 'react';
import MagneticLink from './MagneticLink';

const LINKS = [
  { href: '/#studio', label: 'Studio' },
  { href: '/#practice', label: 'Practice' },
  { href: '/interiors', label: 'Interiors' },
  { href: '/work', label: 'Work' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] h-[76px] flex items-center transition-colors duration-300 border-b ${
        scrolled ? 'bg-paper/90 backdrop-blur-md border-line' : 'border-transparent'
      }`}
    >
      <div className="w-full max-w-[1240px] mx-auto px-6 md:px-10 flex items-center justify-between">
        <a href="/#top" className="flex flex-col items-center leading-none select-none">
          <span className="font-display font-extrabold text-[24px] tracking-tight">
            <span style={{ color: '#E31E24' }}>W</span>
            <span style={{ color: '#58595B' }}>e</span>{' '}
            <span style={{ color: '#E31E24' }}>D</span>
            <span style={{ color: '#58595B' }}>
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
          <span className="w-full h-[2px] bg-[#58595B] mt-[3px]" />
          <span className="mt-[3px] font-sans text-[10px] tracking-wide" style={{ color: '#58595B' }}>
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
              <span className="absolute left-0 bottom-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <MagneticLink
          href="/#contact"
          className="hidden md:inline-flex border border-ink px-5 py-2.5 text-xs font-mono tracking-wide uppercase transition-colors hover:bg-ink hover:text-paper"
        >
          Start a project
        </MagneticLink>

        <button
          aria-label="Menu"
          className="md:hidden flex flex-col gap-1.5 p-1.5"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="w-6 h-px bg-ink block" />
          <span className="w-6 h-px bg-ink block" />
          <span className="w-6 h-px bg-ink block" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-[76px] left-0 right-0 bg-paper border-b border-line flex flex-col gap-5 p-6">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-mono text-sm uppercase" onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

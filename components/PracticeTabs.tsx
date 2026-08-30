'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Practice = {
  idx: string;
  label: string;
  title: string;
  body: string;
  href?: string;
  icon: React.ReactElement;
};

const PRACTICES: Practice[] = [
  {
    idx: '01',
    label: 'Planning',
    title: 'Site & master planning',
    body: 'Layout strategy for residential, commercial and industrial land — density, access and phasing worked out before a single elevation is drawn.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-14 h-14 stroke-ink fill-none" strokeWidth={1.1}>
        <rect x="6" y="6" width="36" height="36" />
        <path d="M6 20h36M20 6v36M6 32h14" />
      </svg>
    ),
  },
  {
    idx: '02',
    label: 'Design',
    title: 'Architectural design',
    body: 'From high-end residential towers to large-format commercial and industrial buildings, designed to be built, not just rendered.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-14 h-14 stroke-ink fill-none" strokeWidth={1.1}>
        <path d="M8 40V16l16-10 16 10v24" />
        <path d="M8 40h32M20 40V24h8v16" />
      </svg>
    ),
  },
  {
    idx: '03',
    label: 'Approvals',
    title: 'CRZ approvals',
    body: 'Coastal Regulation Zone clearances carried through to sign-off — over 1,000 acres navigated for clients building along the coast.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-14 h-14 stroke-ink fill-none" strokeWidth={1.1}>
        <path d="M6 30c8-14 28-14 36 0" />
        <path d="M6 30h36M12 36h24" />
        <circle cx="24" cy="14" r="4" />
      </svg>
    ),
  },
  {
    idx: '04',
    label: 'Interiors',
    title: 'Interior design',
    body: 'Bespoke, turnkey interiors for high-end residential and executive spaces — from material curation to final installation.',
    href: '/interiors',
    icon: (
      <svg viewBox="0 0 48 48" className="w-14 h-14 stroke-ink fill-none" strokeWidth={1.1}>
        <rect x="8" y="8" width="32" height="32" />
        <path d="M8 28h32M20 28v12M28 8v8" />
        <circle cx="30" cy="17" r="3" />
      </svg>
    ),
  },
];

export default function PracticeTabs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // useLayoutEffect (not useEffect): ScrollTrigger's `pin` rewraps this
  // section in its own spacer div outside React's tree. That rewrap has to
  // be reverted by st.kill() synchronously before React detaches the node
  // on unmount (e.g. navigating away) — a plain useEffect's cleanup runs
  // too late, after React's own removeChild, and throws
  // "NotFoundError: node to be removed is not a child of this node".
  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const n = PRACTICES.length;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${n * 100}%`,
      pin: true,
      scrub: 0.3,
      onUpdate: (self) => {
        const idx = Math.min(n - 1, Math.floor(self.progress * n));
        setActive(idx);
      },
    });

    return () => st.kill();
  }, []);

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const trigger = ScrollTrigger.getAll().find((t) => t.trigger === el);
    if (!trigger) return;
    const target = trigger.start + (i / PRACTICES.length) * (trigger.end - trigger.start) + 4;
    gsap.to(window, { duration: 1, scrollTo: { y: target }, ease: 'power2.inOut' });
  };

  const current = PRACTICES[active];

  return (
    <section id="practice" ref={sectionRef} className="relative h-screen overflow-hidden bg-paper/92">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 h-full flex flex-col justify-center">
        <div className="flex items-end justify-between gap-10 mb-10 md:mb-16">
          <h2 className="font-display font-medium text-[clamp(28px,3.4vw,46px)] max-w-[14ch]">
            What we practice
          </h2>
          <p className="hidden md:block max-w-[34ch] text-muted text-[15px] leading-relaxed">
            Three disciplines, one continuous process — scroll to move through each.
          </p>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-16 items-center">
          {/* tab list */}
          <div className="flex md:flex-col gap-3 md:gap-2">
            {PRACTICES.map((p, i) => (
              <button
                key={p.idx}
                onClick={() => jumpTo(i)}
                className={`text-left font-mono text-xs tracking-widest uppercase py-3 px-4 border transition-colors ${
                  active === i ? 'border-ink bg-ink text-paper' : 'border-line text-muted hover:border-ink'
                }`}
              >
                {p.idx} / {p.label}
              </button>
            ))}
          </div>

          {/* active panel */}
          <div key={active} className="animate-[fadein_0.5s_ease]">
            {current.icon}
            <h3 className="font-display text-2xl md:text-3xl font-medium mt-6 mb-4">{current.title}</h3>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-[52ch]">{current.body}</p>
            {current.href && (
              <Link
                href={current.href}
                className="mt-5 inline-block font-mono text-xs tracking-widest uppercase border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
              >
                Learn more →
              </Link>
            )}
          </div>
        </div>

        {/* progress dots */}
        <div className="flex gap-2 mt-12">
          {PRACTICES.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                active === i ? 'w-8 bg-accent' : 'w-3 bg-line'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

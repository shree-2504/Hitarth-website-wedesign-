'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Practice = {
  idx: string;
  label: string;
  title: string;
  body: string;
  href?: string;
  icon: React.ReactElement;
  /** Work of this discipline, shown beside the copy. */
  image: { src: string; alt: string };
};

const PRACTICES: Practice[] = [
  {
    idx: '01',
    label: 'Portfolio',
    title: 'Planning & design, built',
    body: 'Site strategy and architecture across residential, commercial and industrial land — density, access and phasing resolved before a single elevation is drawn, then carried through to something that gets built rather than rendered.',
    href: '/work',
    icon: (
      <svg viewBox="0 0 48 48" className="w-14 h-14 stroke-ink fill-none" strokeWidth={1.1}>
        <rect x="6" y="6" width="36" height="36" />
        <path d="M6 20h36M20 6v36M6 32h14" />
      </svg>
    ),
    image: {
      src: '/images/coastal-towers.jpg',
      alt: 'Seasons, a multi-tower residential masterplan, aerial view',
    },
  },
  {
    idx: '02',
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
    image: {
      src: '/images/night-aerial.jpg',
      alt: 'Aerial view of a residential site set within green land, the kind of setting that requires environmental clearance',
    },
  },
  {
    idx: '03',
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
    image: {
      src: '/images/interior/3bhk-living-room-1.jpg',
      alt: 'Living room of a 3BHK apartment fitted out by the studio',
    },
  },
];

export default function PracticeTabs() {
  const [active, setActive] = useState(0);
  const current = PRACTICES[active];

  return (
    <section id="practice" className="relative bg-paper/40 py-14 md:py-20">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        {/* No section heading: the standfirst carries the lead on its own, so
            it moves to the left where the title used to sit rather than
            staying pinned right against nothing. */}
        <div className="mb-8 md:mb-10">
          <p className="max-w-[44ch] text-muted text-[17px] md:text-[19px] leading-relaxed">
            Three strands of the practice, one continuous process — click through each.
          </p>
        </div>

        {/* Three columns: the tab list, the copy, and the work itself. The
            section used to run tabs + copy only, which left the right half and
            the lower third of the band empty on the section that explains what
            the studio actually does. */}
        <div className="grid md:grid-cols-[248px_minmax(0,1fr)_minmax(0,0.9fr)] gap-10 md:gap-14 items-center">
          {/* Tab list. Enlarged from 12px in 200x42 boxes: the contrast was
              already fine at 5.4:1, so the problem was scale rather than
              colour — these are the section's only controls and were reading
              as captions. The inactive border is also lifted off `line`, which
              is a hairline token and too faint to describe a control. */}
          <div className="grid grid-cols-3 gap-2 md:flex md:flex-col md:gap-2.5 min-w-0">
            {PRACTICES.map((p, i) => (
              <button
                key={p.idx}
                onClick={() => setActive(i)}
                className={`text-left font-mono text-[11px] tracking-[0.1em] py-3 px-3 md:text-[13.5px] md:tracking-[0.14em] md:py-4 md:px-5 uppercase border transition-colors ${
                  active === i
                    ? 'border-ink bg-ink text-paper'
                    : 'border-ink/30 text-muted hover:border-ink hover:text-ink'
                }`}
              >
                {p.idx} / {p.label}
              </button>
            ))}
          </div>

          {/* active panel */}
          <div key={active} className="min-w-0 animate-[fadein_0.5s_ease]">
            {current.icon}
            {/* h2, not h3: with the section heading gone this is the section's
                top-level heading, and an h3 here would skip a level under the
                page's h1. */}
            <h2 className="font-display text-2xl md:text-3xl font-medium mt-6 mb-4">{current.title}</h2>
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

          {/* keyed on `active` so the image cross-fades with the copy */}
          <div
            key={`img-${active}`}
            className="relative aspect-[4/5] bg-[#2D2D2D] overflow-hidden animate-[fadein_0.5s_ease]"
          >
            <Image
              src={current.image.src}
              alt={current.image.alt}
              fill
              sizes="(min-width: 768px) 32vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

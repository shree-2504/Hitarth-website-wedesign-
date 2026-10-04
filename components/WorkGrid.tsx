'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

function formatCategory(cat: string) {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

// Frames are a single landscape ratio and the columns align, which is how the
// reference actually settles. An earlier pass gave each column a standing
// offset after reading a frame caught mid-animation — the drift there is the
// entrance, staggered in time, not a permanent step in the layout. That's
// handled by the ScrollTrigger stagger below.
const FRAME = 'aspect-[4/3]';

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState('all');
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory);

  // The page-wide ScrollReveals singleton only scans for .reveal-clip once,
  // at initial mount — switching filters swaps in brand-new DOM nodes it
  // never saw, which stay clipped shut forever. Re-scan scoped to this grid
  // every time the filtered set changes.
  useEffect(() => {
    if (!rootRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = gsap.utils.toArray<HTMLElement>('.reveal-clip', rootRef.current);

    if (reduceMotion) {
      els.forEach((el) => el.classList.add('gsap-in'));
      return;
    }

    const triggers = ScrollTrigger.batch(els, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.07,
        }),
    });

    return () => triggers.forEach((t) => t.kill());
  }, [activeCategory]);

  return (
    <div ref={rootRef} className="max-w-[1240px] mx-auto px-6 md:px-10">
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-3 mb-12 md:mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs tracking-widest uppercase py-2.5 px-4 border transition-colors ${
                activeCategory === cat
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink/35 text-ink/70 hover:border-ink hover:text-ink'
              }`}
            >
              {cat === 'all' ? 'All' : formatCategory(cat)}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-16 md:gap-y-20 items-start">
        {filtered.map((p, i) => (
          <Link
            key={p.id}
            href={`/work/${p.slug}`}
            data-cursor-label="Open"
            className="group block"
          >
            <div className={`reveal-clip relative overflow-hidden bg-[#1c1c1a] ${FRAME}`}>
              <Image
                src={p.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
            </div>

            {p.category && (
              <span className="block mt-6 font-mono text-[10px] tracking-[0.22em] uppercase text-muted">
                {formatCategory(p.category)}
              </span>
            )}

            <h2 className="font-display font-medium text-[19px] md:text-[21px] leading-[1.25] mt-2.5 max-w-[22ch] group-hover:text-accent transition-colors">
              {p.title}
            </h2>

            {/* Several projects carry a location that just repeats the
                category — "Institutional" set under an INSTITUTIONAL label.
                Show the line only when it adds something. */}
            {p.location && p.location.toLowerCase() !== (p.category || '').toLowerCase() && (
              <span className="block mt-1.5 text-muted text-[13.5px] leading-relaxed">
                {p.location}
              </span>
            )}

            {/* Label, a long rule, and a ring sitting over the end of it — the
                rule reads as the arrow's shaft running into the head. The rule
                lengthens on hover rather than the whole control moving. */}
            <span className="mt-6 flex items-center font-mono text-[10px] tracking-[0.18em] uppercase text-ink">
              View project
              <span
                aria-hidden="true"
                className="ml-4 h-px w-12 bg-ink/45 transition-all duration-300 group-hover:w-16 group-hover:bg-ink"
              />
              <span
                aria-hidden="true"
                className="-ml-3 w-7 h-7 rounded-full border border-ink/35 flex items-center justify-center bg-paper transition-colors duration-300 group-hover:bg-ink group-hover:border-ink group-hover:text-paper"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none" strokeWidth={1.75}>
                  <path d="M5 12h13M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

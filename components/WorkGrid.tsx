'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { typeLabel, type Project } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

function formatCategory(cat: string) {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

// One ratio for every tile. Cycling several was meant to give the wall a
// rhythm, but with `items-start` and no gutters it just left neighbours ending
// at different heights, so the background showed through in uneven wedges and
// the rows never lined up. A single ratio and an even gutter is what makes it
// read as a grid.
const FRAME = 'aspect-[4/3] sm:aspect-[4/5]';

export default function WorkGrid({ projects }: { projects: Project[] }) {
  // In order of first appearance, except the catch-all "others", which always
  // goes last whatever the running order of the projects.
  const found = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
  const categories = ['all', ...found.filter((c) => c !== 'others'), ...found.filter((c) => c === 'others')];
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
    <div ref={rootRef}>
      {categories.length > 2 && (
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap gap-3 mb-8 md:mb-10">
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
        </div>
      )}

      {/* Held to the text column with an even gutter, rather than running to
          the window edge. Three columns divides the six projects into two full
          rows; four would leave two dead cells on the second. */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/work/${p.slug}`}
              data-cursor-label="View"
              className={`reveal-clip group relative block overflow-hidden bg-[#2D2D2D] ${FRAME}`}
            >
              <Image
                src={p.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />

              {/* Dark enough at top and bottom to hold the type on any render,
                  lightest across the middle so the building still reads. */}
              <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/15 to-ink/70 transition-opacity duration-500 group-hover:from-ink/85 group-hover:to-ink/80" />

              {/* Category set vertically up the left edge, like a drawing margin. */}
              {typeLabel(p) && (
                <span className="absolute left-4 bottom-5 font-mono text-[10px] tracking-[0.3em] uppercase text-paper/65 [writing-mode:vertical-rl] rotate-180">
                  {formatCategory(typeLabel(p))}
                </span>
              )}

              <div className="absolute top-6 left-12 right-5">
                <h2 className="font-display font-medium text-paper text-[19px] md:text-[21px] leading-[1.2]">
                  {p.title}
                </h2>
                {/* Several projects carry a location that merely repeats the
                    category; show it only where it adds something. */}
                {p.location && p.location.toLowerCase() !== (typeLabel(p) || '').toLowerCase() && (
                  <span className="block mt-1.5 font-mono text-[10.5px] tracking-widest uppercase text-paper/70">
                    {p.location}
                  </span>
                )}
              </div>

              <span className="absolute bottom-5 right-5 font-mono text-[10px] tracking-widest uppercase text-paper opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                View →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

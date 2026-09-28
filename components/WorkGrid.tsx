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
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.08,
        }),
    });

    return () => triggers.forEach((t) => t.kill());
  }, [activeCategory]);

  return (
    <div ref={rootRef}>
      {categories.length > 2 && (
        <div className="reveal flex flex-wrap gap-3 mb-10 md:mb-14">
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {filtered.map((p) => (
          <Link key={p.id} href={`/work/${p.slug}`} className="group block">
            <div className="reveal-clip relative aspect-[4/5] bg-[#1c1c1a] overflow-hidden">
              <Image
                src={p.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                <span className="font-mono text-[11px] text-paper uppercase tracking-widest inline-flex items-center gap-1.5">
                  View project <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
            <div className="flex justify-between items-baseline mt-4 gap-4">
              {/* h2, not h3: the page's only other heading is its h1, so an h3
                  here skips a level and breaks heading-based navigation. */}
              <h2 className="font-display font-medium text-[17px]">{p.title}</h2>
              <span className="font-mono text-[11px] text-muted uppercase tracking-wide whitespace-nowrap">
                {p.location}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

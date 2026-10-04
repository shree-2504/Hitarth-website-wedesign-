'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { InteriorProject } from '@/data/interiors';

export default function InteriorGallery({ projects }: { projects: InteriorProject[] }) {
  const [active, setActive] = useState<{ project: InteriorProject; index: number } | null>(null);

  const step = (dir: number) => {
    setActive((current) => {
      if (!current) return current;
      const total = current.project.images.length;
      const index = (current.index + dir + total) % total;
      return { project: current.project, index };
    });
  };

  useEffect(() => {
    if (!active) return;
    const lenis = (window as any).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <>
      <div className="space-y-16 md:space-y-20">
        {projects.map((project) => (
          <div key={project.id}>
            <h3 className="reveal font-display font-medium text-2xl md:text-[28px] mb-6 md:mb-8">
              {project.title}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {project.images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActive({ project, index: i })}
                  aria-label={`View ${img.alt} larger`}
                  data-cursor-label="Enlarge"
                  className="reveal-clip group relative block w-full aspect-[4/5] bg-[#2D2D2D] overflow-hidden text-left"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.project.title} photo viewer`}
          className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-10"
        >
          <button
            aria-label="Close image"
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-ink/90 backdrop-blur-sm cursor-pointer"
          />

          <div className="relative w-full max-w-[1100px]">
            <div className="relative w-full h-[62vh] md:h-[78vh]">
              <Image
                src={active.project.images[active.index].src}
                alt={active.project.images[active.index].alt}
                fill
                sizes="92vw"
                className="object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-paper">
              <span className="font-display text-lg">{active.project.title}</span>
              <span className="font-mono text-xs tracking-wide uppercase text-[#AFAEAC]">
                {active.index + 1} / {active.project.images.length}
              </span>
            </div>
          </div>

          {active.project.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
                  <path d="M15 4l-8 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
                  <path d="M9 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          <button
            aria-label="Close image"
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center border border-paper/50 text-paper hover:bg-paper hover:text-ink transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const step = useCallback((dir: number) => {
    setIndex((current) => (current === null ? current : (current + dir + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (index === null) return;
    const lenis = (window as any).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index, step]);

  if (!images.length) return null;

  return (
    <div className="reveal mt-16 pt-9 border-t border-line">
      <span className="font-mono text-[11px] tracking-widest uppercase text-muted">More views</span>
      {/* Column count follows the set so a short one never strands an image
          or leaves a row two-thirds empty: two views share the width, four
          run as a single row, anything else falls into threes. */}
      <div
        className={`grid sm:grid-cols-2 gap-4 mt-6 ${
          images.length === 2 ? '' : images.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
        }`}
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View ${title} image ${i + 1} larger`}
            className="group relative block w-full aspect-[4/5] bg-[#2D2D2D] overflow-hidden"
          >
            <Image
              src={src}
              alt={`${title}, additional view ${i + 1}`}
              fill
              sizes={
                images.length === 2
                  ? '(min-width: 640px) 50vw, 100vw'
                  : images.length === 4
                    ? '(min-width: 768px) 25vw, 50vw'
                    : '(min-width: 768px) 33vw, 50vw'
              }
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {mounted && index !== null
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${title} photo viewer`}
              className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-10"
            >
              <button
                aria-label="Close"
                onClick={() => setIndex(null)}
                className="absolute inset-0 bg-ink/90 backdrop-blur-sm cursor-pointer"
              />

              <div className="relative w-full max-w-[1100px]">
                <div className="relative w-full h-[62vh] md:h-[78vh]">
                  <Image
                    src={images[index]}
                    alt={`${title}, additional view ${index + 1}`}
                    fill
                    sizes="92vw"
                    className="object-contain"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-paper">
                  <span className="font-display text-lg">{title}</span>
                  <span className="font-mono text-xs tracking-wide uppercase text-[#AFAEAC]">
                    {index + 1} / {images.length}
                  </span>
                </div>
              </div>

              {images.length > 1 && (
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
                type="button"
                aria-label="Close"
                onClick={() => setIndex(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center border border-paper/50 text-paper hover:bg-paper hover:text-ink transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

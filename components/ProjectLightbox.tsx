'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/data/projects';

export default function ProjectLightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  // Which image the big panel is showing — reset whenever a new project opens,
  // otherwise the next project inherits the last one's thumbnail index.
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [project?.slug]);

  useEffect(() => {
    if (!project) return;

    const lenis = (window as any).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  // The main image leads, then the project's other angles — the gallery was
  // already on the Project record but the modal only ever showed the cover.
  const shots = [project.imageUrl, ...(project.images ?? [])].filter(Boolean);

  // The reset effect runs after this render, so on the first frame of a new
  // project activeImage can still point past the end of a shorter gallery.
  const current = shots[activeImage] ?? shots[0];

  // e.g. category "residential" inside location tag "Residential Masterplan"
  const impliedByLocation = Boolean(
    project.category && project.location?.toLowerCase().includes(project.category.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-10"
    >
      <button
        aria-label="Close project detail"
        onClick={onClose}
        className="absolute inset-0 bg-ink/85 backdrop-blur-sm cursor-pointer"
      />
      <div className="relative bg-paper w-full max-w-[920px] max-h-[88vh] overflow-y-auto grid md:grid-cols-[1.1fr_0.9fr] shadow-2xl">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-full bg-[#2D2D2D]">
          <Image
            key={current}
            src={current}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover animate-[fadein_0.4s_ease]"
          />
        </div>

        {/* Space-between, so the description sits under the title and the
            action anchors the bottom instead of leaving a dead beige block. */}
        <div className="p-8 md:p-10 flex flex-col justify-between gap-8">
          <div>
            {/* The category tag ("Residential") and the caption tag
                ("Residential Masterplan") repeat each other when stacked, so
                only show the category when it isn't already implied. */}
            {project.category && !impliedByLocation && (
              <span className="font-mono text-[11px] text-muted uppercase tracking-wide">
                {project.category}
              </span>
            )}
            <h3
              id="lightbox-title"
              className="font-display font-medium text-2xl md:text-[28px] mt-3"
            >
              {project.title}
            </h3>
            {project.location && (
              <span className="block font-mono text-[11px] text-muted uppercase tracking-wide mt-2">
                {project.location}
              </span>
            )}
            {project.description && (
              <p className="mt-6 text-[15px] leading-relaxed text-[#2F3031]">
                {project.description}
              </p>
            )}
          </div>

          <div>
            {shots.length > 1 && (
              <div className="flex gap-2.5 mb-7">
                {shots.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1} of ${shots.length}`}
                    aria-current={i === activeImage}
                    data-cursor-label="Show"
                    className={`relative w-14 h-14 overflow-hidden border transition-colors ${
                      i === activeImage
                        ? 'border-ink'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Previously the modal dead-ended here — the full page is where
                the gallery, facts and next project live. */}
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-2 font-mono text-[12px] tracking-widest uppercase border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              View full project <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <button
          aria-label="Close project detail"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

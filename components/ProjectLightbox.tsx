'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { Project } from '@/data/projects';

export default function ProjectLightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
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
        <div className="relative aspect-[4/5] md:aspect-auto md:h-full bg-[#1c1c1a]">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-8 md:p-10 flex flex-col">
          {project.category && (
            <span className="font-mono text-[11px] text-muted uppercase tracking-wide">
              {project.category}
            </span>
          )}
          <h3 id="lightbox-title" className="font-display font-medium text-2xl md:text-[28px] mt-3">
            {project.title}
          </h3>
          {project.location && (
            <span className="font-mono text-[11px] text-muted uppercase tracking-wide mt-2">
              {project.location}
            </span>
          )}
          {project.description && (
            <p className="mt-6 text-[15px] leading-relaxed text-[#3B3934]">{project.description}</p>
          )}
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

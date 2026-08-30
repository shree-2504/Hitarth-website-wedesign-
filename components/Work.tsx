'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/data/projects';
import WorkGallery from './WorkGallery';
import ProjectLightbox from './ProjectLightbox';

function formatCategory(cat: string) {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export default function Work({ projects }: { projects: Project[] }) {
  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filtered =
    activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="bg-paper/90 py-24 md:py-[120px] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 mb-10">
          <h2 className="reveal font-display font-medium text-[clamp(30px,3.4vw,46px)] max-w-[14ch]">
            Selected work
          </h2>
          <div className="reveal flex flex-col items-start md:items-end gap-4">
            <p className="max-w-[34ch] text-muted text-[15px] leading-relaxed">
              60+ residential, commercial and industrial projects — a sample of what&apos;s on
              the drawing board and what&apos;s built.
            </p>
            <Link
              href="/work"
              className="font-mono text-xs tracking-widest uppercase border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              View all work →
            </Link>
          </div>
        </div>

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
      </div>

      <WorkGallery key={activeCategory} projects={filtered} onSelect={setActiveProject} />

      <ProjectLightbox project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}

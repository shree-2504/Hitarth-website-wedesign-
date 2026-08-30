import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Contact from '@/components/Contact';
import ProjectGallery from '@/components/ProjectGallery';
import { getProjects, getProjectBySlug } from '@/lib/sanity/queries';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: `${project.title} — We Design Architects`,
    description: project.description || `${project.title}, ${project.location}.`,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(params.slug),
    getProjects(),
  ]);

  if (!project) notFound();

  const index = allProjects.findIndex((p) => p.slug === project.slug);
  const next = index >= 0 ? allProjects[(index + 1) % allProjects.length] : null;

  return (
    <>
      <div className="relative h-[70vh] min-h-[420px] mt-[76px]">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <section className="bg-paper/90 py-16 md:py-24">
        <div className="max-w-[880px] mx-auto px-6 md:px-10">
          <Link
            href="/work"
            className="font-mono text-[11px] tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            ← All work
          </Link>

          {project.category && (
            <div className="eyebrow mt-8 mb-4">{project.category}</div>
          )}
          <h1 className="font-display font-medium text-[clamp(30px,4vw,48px)] leading-tight">
            {project.title}
          </h1>
          {project.location && (
            <span className="block font-mono text-[11px] text-muted uppercase tracking-wide mt-3">
              {project.location}
            </span>
          )}
          {project.description && (
            <p className="mt-8 text-lg leading-relaxed text-[#3B3934] max-w-[68ch]">
              {project.description}
            </p>
          )}

          <ProjectGallery images={project.images ?? []} title={project.title} />

          {next && (
            <div className="mt-16 pt-9 border-t border-line flex justify-between items-baseline gap-6">
              <span className="font-mono text-[11px] tracking-widest uppercase text-muted">
                Next project
              </span>
              <Link
                href={`/work/${next.slug}`}
                className="font-display font-medium text-xl hover:text-accent transition-colors"
              >
                {next.title} →
              </Link>
            </div>
          )}
        </div>
      </section>

      <Contact />
    </>
  );
}

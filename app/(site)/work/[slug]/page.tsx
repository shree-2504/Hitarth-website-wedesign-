import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Contact from '@/components/Contact';
import ProjectGallery from '@/components/ProjectGallery';
import { getProjects, getProjectBySlug } from '@/lib/sanity/queries';
import { typeLabel } from '@/data/projects';

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

  const description = project.description || `${project.title}, ${project.location}.`;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    // The project's own photograph makes a far better share card than the
    // site-wide default, and it's already on hand.
    openGraph: {
      type: 'article',
      title: project.title,
      description,
      url: `/work/${project.slug}`,
      images: [{ url: project.imageUrl, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: [project.imageUrl],
    },
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

  // Only the facts actually filled in for this project make it onto the page.
  const facts = [
    { label: 'Year', value: project.year },
    { label: 'Client', value: project.client },
    { label: 'Area', value: project.area },
    { label: 'Status', value: project.status },
    { label: 'Scope', value: project.scope },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <>
      <div className="relative h-[70vh] min-h-[420px] mt-[76px] overflow-hidden bg-ink">
        {project.imageFit === 'contain' ? (
          <>
            {/* Backdrop: the same image, blurred and dimmed, so the band
                still reads as a full-width header around the whole picture. */}
            <Image
              src={project.imageUrl}
              alt=""
              aria-hidden="true"
              fill
              sizes="50vw"
              className="object-cover scale-110 blur-2xl opacity-60"
            />
            {/* A 4:3 frame rather than the whole square: fitting the full
                image left the building small in the band, while filling the
                band magnified it threefold. The fixed shape keeps the crop the
                same on every window, so short screens don't lose the sign
                along the top; it trims only sky and road. */}
            <div className="absolute inset-y-5 md:inset-y-7 left-1/2 -translate-x-1/2 w-[94%] md:w-auto md:max-w-[94%] md:aspect-[4/3]">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 872px) 820px, 94vw"
                // On phones the frame is tall, so the whole square fits.
                className="object-contain md:object-cover"
                style={{ objectPosition: project.imagePosition ?? 'center 58%' }}
              />
            </div>
          </>
        ) : (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: project.imagePosition ?? 'center' }}
          />
        )}
      </div>

      <section className="bg-paper/40 py-14 md:py-20">
        <div className="max-w-[880px] mx-auto px-6 md:px-10">
          <Link
            href="/work"
            className="font-mono text-[11px] tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            ← All work
          </Link>

          {typeLabel(project) && (
            <div className="eyebrow mt-8 mb-4">{typeLabel(project)}</div>
          )}
          <h1 className="font-display font-medium text-[clamp(30px,4vw,48px)] leading-tight">
            {project.title}
          </h1>
          {project.location && project.location !== typeLabel(project) && (
            <span className="block font-mono text-[11px] text-muted uppercase tracking-wide mt-3">
              {project.location}
            </span>
          )}
          {project.description && (
            <p className="mt-8 text-lg leading-relaxed text-[#2F3031] max-w-[68ch]">
              {project.description}
            </p>
          )}

          {facts.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-7 border-t border-line pt-8">
              {facts.map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-mono text-[11px] tracking-widest uppercase text-muted">
                    {label}
                  </dt>
                  <dd className="mt-2 font-display text-lg leading-snug">{value}</dd>
                </div>
              ))}
            </dl>
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

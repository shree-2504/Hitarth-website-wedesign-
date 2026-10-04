import type { Metadata } from 'next';
import WorkGrid from '@/components/WorkGrid';
import Contact from '@/components/Contact';
import { getProjects } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Residential, commercial, industrial and institutional projects by We Design Architects — planning, design and CRZ approvals across Mumbai.',
  alternates: { canonical: '/work' },
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="bg-paper/90 pt-[140px] md:pt-[168px] pb-24 md:pb-[120px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="eyebrow reveal mb-5">Portfolio</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 mb-14 md:mb-20">
            <h1 className="reveal font-display font-medium text-[clamp(34px,4.4vw,58px)] max-w-[16ch]">
              Selected work
            </h1>
            {/* This used to print `{projects.length}+`, which rendered as
                "7+ projects" — a number small enough to undercut the studio
                rather than support it, and odd-looking with the plus. The
                practice's actual record belongs in the claim; the page is a
                selection from it. */}
            <p className="reveal max-w-[34ch] text-muted text-[15px] leading-relaxed">
              A selection from 60+ residential, commercial, industrial and institutional
              projects — from first sketch to CRZ sign-off.
            </p>
          </div>

          <WorkGrid projects={projects} />
        </div>
      </section>

      <Contact />
    </>
  );
}

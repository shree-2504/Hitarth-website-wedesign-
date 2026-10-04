import type { Metadata } from 'next';
import Image from 'next/image';
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
      {/* Type holds the left, the photograph runs off the right edge rather
          than sitting behind everything. Keeping the ground as paper means the
          header stays ink and the page opens the way the rest of the site does. */}
      <section className="relative bg-paper/90 overflow-hidden pt-[128px] md:pt-[150px] pb-16 md:pb-24">
        {/* Starts below the 76px header band so the ink nav and the "Start a
            project" button never sit on top of the render. */}
        <div className="hidden md:block absolute top-[76px] right-0 bottom-0 w-[46%] lg:w-[44%]">
          <Image
            src="/images/work/sk-heights-1.jpg"
            alt="S.K. Heights residential tower by We Design Architects"
            fill
            priority
            sizes="46vw"
            className="object-cover"
          />
          {/* Feathers the photograph into the paper instead of ending on a hard
              seam, so the bleed reads as composition rather than a cropped box. */}
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-paper to-transparent" />
        </div>

        <div className="relative max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="md:max-w-[54%]">
            <div className="eyebrow reveal mb-7">Portfolio</div>

            <h1 className="reveal font-display font-normal uppercase leading-[0.94] tracking-[0.06em] text-[clamp(44px,8.5vw,104px)]">
              Projects
            </h1>

            <p className="reveal mt-8 max-w-[46ch] text-[15px] md:text-base leading-relaxed text-[#3B3934]">
              A selection from 60+ residential, commercial, industrial and institutional
              projects — planning, design and CRZ approvals carried from first sketch
              through to sign-off.
            </p>

            {/* Mobile gets the photograph inline, since there's no right-hand
                column for it to bleed into. */}
            <div className="md:hidden reveal-clip relative aspect-[4/3] mt-10 bg-[#1c1c1a] overflow-hidden">
              <Image
                src="/images/work/sk-heights-1.jpg"
                alt="S.K. Heights residential tower by We Design Architects"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper/90 pb-24 md:pb-[120px]">
        <WorkGrid projects={projects} />
      </section>

      <Contact />
    </>
  );
}

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
      {/* Full-bleed masthead with the title set over the work. The site header
          switches to paper across this — see DARK_HERO_ROUTES in Header. */}
      <div className="relative h-[46vh] min-h-[320px] md:h-[54vh] overflow-hidden bg-ink">
        <Image
          src="/images/residential-tower-1.jpg"
          alt="Gulmohar Homes residential tower by We Design Architects"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Weighted to the top and centre: the header's paper nav sits in the
            first 76px and the title lands mid-frame, both over a render that
            is bright where the building catches light. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/65 to-ink/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display font-medium text-paper text-[clamp(30px,6vw,64px)] tracking-[0.2em] uppercase">
            Projects
          </h1>
          {/* Light grey sat too close to the render behind it here — the tower
              is brightest exactly where this line falls. */}
          <p className="mt-5 max-w-[46ch] text-paper/85 text-[14px] md:text-[15px] leading-relaxed">
            A selection from 60+ residential, commercial, industrial and institutional
            projects — from first sketch to CRZ sign-off.
          </p>
        </div>
      </div>

      {/* The grid sets its own width so the tiles run to the window edge; only
          the filter row is held to the text column. */}
      <section className="bg-paper/40 pt-9 md:pt-12 pb-24 md:pb-[120px]">
        <WorkGrid projects={projects} />

        {/* The page shows six projects against a claim of sixty-plus. Rather
            than leave that gap unaddressed, it becomes the invitation. */}
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 mt-16 md:mt-20">
          <div className="border-t border-line pt-10 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-5">
            <p className="font-display text-xl md:text-2xl font-medium max-w-[26ch] leading-snug">
              And many more.
            </p>
            <a
              href="/#contact"
              className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-accent hover:text-ink transition-colors"
            >
              Contact the studio for the rest of the portfolio
              <span
                aria-hidden="true"
                className="w-8 h-8 shrink-0 rounded-full border border-accent/40 flex items-center justify-center transition-colors duration-300 group-hover:bg-ink group-hover:border-ink group-hover:text-paper"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none" strokeWidth={1.75}>
                  <path d="M5 12h13M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Contact from '@/components/Contact';
import InteriorGallery from '@/components/InteriorGallery';
import { interiorProjects } from '@/data/interiors';

export const metadata: Metadata = {
  title: 'Interiors',
  description:
    'Bespoke, turnkey interiors for high-end residential and executive spaces — from the first material board to the final fitting, by the studio that draws the building.',
  alternates: { canonical: '/interiors' },
};

// Written to match the practice section rather than sell: each one names what
// the studio actually hands over, not an adjective.
const FEATURES = [
  {
    title: 'Spatial planning',
    body: 'Circulation, storage and services resolved before a single finish is chosen.',
  },
  {
    title: 'Material curation',
    body: 'Finishes, fittings and surfaces specified and sourced here — not left to the contractor.',
  },
  {
    title: 'Turnkey execution',
    body: 'Visualised in 3D, then carried to handover by the same team that drew it.',
  },
];

export default function InteriorsPage() {
  return (
    <>
      <section className="bg-paper/55 pt-[140px] md:pt-[168px] pb-24 md:pb-[120px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          {/* Text and image side by side: the page previously opened on ~700px
              of copy before showing a single room, on a page selling rooms. */}
          <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-16 items-center">
            <div>
              <div className="eyebrow reveal mb-5">Interiors</div>

              <h1 className="reveal font-display font-medium text-[clamp(30px,4.4vw,52px)] max-w-[18ch] leading-[1.08]">
                The drawing <em className="not-italic md:italic text-accent">doesn&apos;t stop</em>{' '}
                at the wall.
              </h1>

              <p className="reveal mt-6 max-w-[54ch] text-[15px] md:text-base leading-relaxed text-[#2F3031]">
                The same studio that draws the building details the rooms inside it — bespoke,
                turnkey interiors for high-end residential and executive spaces, from the first
                material board to the final fitting.
              </p>
            </div>

            <div className="reveal-clip relative aspect-[4/5] md:aspect-[4/5] bg-[#2D2D2D] overflow-hidden">
              <Image
                src="/images/interior/entrance-lobby-1.jpg"
                alt="Entrance lobby with reception desk, designed and fitted out by We Design Architects"
                fill
                priority
                sizes="(min-width: 768px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <h2 className="reveal font-display font-medium text-2xl md:text-[28px] mt-20 md:mt-28 mb-8 md:mb-10">
            What that covers
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="reveal border-t border-line pt-6">
                <h3 className="font-display font-medium text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-[15px] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="eyebrow reveal mt-16 md:mt-20 mb-8 md:mb-10">Featured interior projects</div>

          <InteriorGallery projects={interiorProjects} />
        </div>
      </section>

      <Contact />
    </>
  );
}

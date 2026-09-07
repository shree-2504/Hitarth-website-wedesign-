import type { Metadata } from 'next';
import Contact from '@/components/Contact';
import InteriorGallery from '@/components/InteriorGallery';
import { interiorProjects } from '@/data/interiors';

export const metadata: Metadata = {
  title: 'Interiors',
  description:
    'Bespoke architectural and interior spaces that blend luxury, functionality and clean modern aesthetics — from signature residential homes to high-end executive spaces.',
  alternates: { canonical: '/interiors' },
};

const FEATURES = [
  {
    title: 'Tailored Aesthetics',
    body: 'Custom material curation, premium finishes, and meticulous detail.',
  },
  {
    title: 'Turnkey Execution',
    body: 'Seamless flow from 3D visual concepts to flawless final installation.',
  },
  {
    title: 'Architectural Precision',
    body: 'Smart spatial planning designed for modern living and working.',
  },
];

export default function InteriorsPage() {
  return (
    <>
      <section className="bg-paper/90 pt-[140px] md:pt-[168px] pb-24 md:pb-[120px]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="eyebrow reveal mb-5">Interiors</div>

          <h1
            className="reveal font-display font-medium text-[clamp(30px,4.4vw,52px)] max-w-[20ch] leading-tight"
            style={{ color: '#E31E24' }}
          >
            Transform Your Space into a Masterpiece
          </h1>

          <p className="reveal font-display font-semibold text-lg md:text-xl mt-6 max-w-[42ch]">
            Elevated Interiors. Timeless Sophistication.
          </p>

          <p className="reveal mt-6 max-w-[62ch] text-[15px] md:text-base leading-relaxed text-[#3B3934]">
            At <span style={{ color: '#E31E24' }}>W</span>e{' '}
            <span style={{ color: '#E31E24' }}>D</span>esign Architects, we craft bespoke
            architectural and interior spaces that blend luxury, functionality, and clean modern
            aesthetics. From signature residential homes to high-end executive spaces, we turn
            visionary concepts into refined visual realities.
          </p>

          <h2
            className="reveal font-display font-medium text-2xl md:text-[28px] mt-16 md:mt-20 mb-8 md:mb-10"
            style={{ color: '#E31E24' }}
          >
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="reveal border-t border-line pt-6">
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
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

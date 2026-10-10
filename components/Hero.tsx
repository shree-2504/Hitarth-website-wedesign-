'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

/** Plate corners, drawn as registration marks that overshoot the outline. */
const CORNERS = [
  'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
];

/**
 * The landing hero: a looping film of a site going from cleared ground to
 * finished towers, behind a fixed statement about the studio.
 */
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  // Reduced motion: hold on the poster frame rather than play. Otherwise call
  // play() explicitly — `autoPlay` alone is ignored by some mobile browsers
  // until the element has been nudged, even when muted.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      return;
    }
    // Slowed so the build-up reads as a measured process rather than a
    // time-lapse rush: the 10s clip plays over 20s. Reapplied whenever the
    // media (re)loads or starts, since loading a source resets playbackRate
    // and autoPlay can start the film before this effect has run.
    const rate = 10 / 20;
    const slow = () => {
      v.defaultPlaybackRate = rate;
      v.playbackRate = rate;
    };
    slow();
    v.addEventListener('loadedmetadata', slow);
    v.addEventListener('play', slow);
    v.play().catch(() => {
      /* Autoplay refused (e.g. power-saving mode): the poster stays up. */
    });
    return () => {
      v.removeEventListener('loadedmetadata', slow);
      v.removeEventListener('play', slow);
    };
  }, []);

  // Plate entrance: the outline draws in, then the copy rises line by line.
  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from(plate, { opacity: 0, scale: 0.97, duration: 0.9, ease: 'power3.out' })
        .from('[data-rise]', { opacity: 0, y: 18, duration: 0.7, stagger: 0.09, ease: 'power3.out' }, '-=0.5');
    }, plate);
    return () => ctx.revert();
  }, []);

  // Mouse parallax on the film, desktop only.
  useEffect(() => {
    const host = heroRef.current;
    const film = filmRef.current;
    if (!host || !film) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const x = gsap.quickTo(film, 'x', { duration: 0.9, ease: 'power3.out' });
    const y = gsap.quickTo(film, 'y', { duration: 0.9, ease: 'power3.out' });
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      x(((e.clientX - r.left) / r.width - 0.5) * -18);
      y(((e.clientY - r.top) / r.height - 0.5) * -12);
    };
    const onLeave = () => { x(0); y(0); };
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);
    return () => {
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div id="top" ref={heroRef} className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink">
      {/* Oversized by a few percent so the parallax shift never exposes an
          edge. Muted and playsInline are both required for autoplay on iOS. */}
      <div ref={filmRef} className="absolute -inset-[3%]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          // Kept in colour so it reads as a real place, but held well down so
          // the statement on top is what the eye lands on first.
          style={{ filter: 'saturate(0.75) brightness(0.55) contrast(1.05)' }}
          src="/videos/hero.mp4"
          poster="/images/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      {/* Shade only where type sits — under the header, behind the plate and
          at the foot — so the middle distance of the film stays bright. */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%)',
            'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 30%)',
            'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(10,14,16,0.5), rgba(10,14,16,0) 75%)',
          ].join(', '),
        }}
      />

      {/* The practice, running up the left edge like a drawing margin. */}
      <span className="absolute left-5 top-1/2 -translate-y-1/2 z-[3] hidden lg:block font-mono text-[10px] tracking-[0.34em] uppercase text-[#FFFFFF]/55 [writing-mode:vertical-rl] rotate-180">
        Planning · Design · CRZ Approvals
      </span>

      <div className="relative z-[2] h-full flex flex-col items-center justify-center px-6 md:px-10 py-24 text-[#FFFFFF]">
        <div
          ref={plateRef}
          className="relative w-full max-w-[960px] text-center border border-[#FFFFFF]/30 bg-[#0B0F11]/55 backdrop-blur-[8px] px-6 py-9 sm:px-14 sm:py-14 md:px-20 md:py-16"
        >
          {CORNERS.map((c) => (
            <span key={c} aria-hidden="true" className={`absolute ${c} w-4 h-4`}>
              <span className="absolute left-1/2 top-0 h-full w-px bg-[#FFFFFF]/80" />
              <span className="absolute top-1/2 left-0 w-full h-px bg-[#FFFFFF]/80" />
            </span>
          ))}

          <p data-rise className="inline-flex items-center gap-3 font-mono text-[12px] md:text-[13px] tracking-[0.26em] uppercase text-[#FFFFFF]/85 mb-5 md:mb-7">
            <span className="w-8 h-px bg-[#E31E24]" />
            The studio
            <span className="w-8 h-px bg-[#E31E24]" />
          </p>

          <h1 data-rise className="font-display font-medium leading-[1.2] text-[clamp(22px,2.6vw,36px)] text-balance">
            <span className="text-[#E31E24]">W</span>E <span className="text-[#E31E24]">D</span>ESIGN, a Mumbai-based architectural studio working across design, planning, and
            regulatory processes.
          </h1>

          <div className="mt-6 md:mt-8 space-y-4 md:space-y-5 text-[15px] md:text-[18px] leading-relaxed text-[#FFFFFF]/90 text-balance sm:[text-wrap:wrap] sm:text-justify sm:[text-align-last:center]">
            <p data-rise>
              Turning an architectural vision into reality requires more than just great design —
              it demands seamless regulatory approval. As specialists in architectural design
              permissions and Coastal Regulation Zone (CRZ) clearance, we bridge the gap between
              ambitious design and complex statutory compliance.
            </p>
            <p data-rise>
              We believe good architecture comes from understanding its context, constraints, and
              possibilities—and turning them into meaningful spaces.
            </p>
          </div>

          <div data-rise>
            <Link
              href="/work"
              data-cursor-label="View"
              className="group mt-7 md:mt-9 inline-flex items-center gap-3 bg-[#FFFFFF] text-ink hover:bg-[#E31E24] hover:text-[#FFFFFF] transition-colors px-7 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase"
            >
              Look more
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none transition-transform group-hover:translate-x-1" strokeWidth={1.6}>
                <path d="M5 12h13M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 right-6 md:right-10 z-[2] flex items-center gap-2.5 text-[#FFFFFF] font-mono text-[11px] tracking-widest uppercase">
        <span className="relative w-px h-[34px] bg-[#FFFFFF] overflow-hidden">
          <span className="absolute left-0 w-full h-full bg-accent animate-scrollcue" />
        </span>
        Scroll
      </div>
    </div>
  );
}

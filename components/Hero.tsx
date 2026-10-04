'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import type { Project } from '@/data/projects';

const AUTOPLAY_MS = 6500;

/**
 * The landing hero: a rotating showcase of the studio's work.
 *
 * The practice's thesis stays pinned above the rotating block rather than
 * becoming one of the slides — a visitor landing mid-rotation should still be
 * told what the studio does, not just which building they happen to be looking
 * at. Only the work beneath it changes.
 */
export default function Hero({ projects }: { projects: Project[] }) {
  const slides = projects.slice(0, 4);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  const go = useCallback(
    (dir: number) => {
      setActive((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Autoplay. Paused while the pointer is over the hero, while the tab is
  // hidden, and entirely for anyone who asked for reduced motion — a carousel
  // that advances under you is the most common complaint about this pattern.
  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // The copy re-enters on each slide; the frames cross-fade via CSS.
  useEffect(() => {
    if (!copyRef.current || reduceRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line',
        { yPercent: 108 },
        { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.06 }
      );
      gsap.fromTo(
        '.hero-fade',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.15 }
      );
    }, copyRef);
    return () => ctx.revert();
  }, [active]);

  // Slow drift on the active frame, so a held slide is never completely still.
  useEffect(() => {
    if (!framesRef.current || reduceRef.current) return;
    const el = framesRef.current.children[active] as HTMLElement | undefined;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { scale: 1.02 }, { scale: 1.1, duration: AUTOPLAY_MS / 1000 + 2, ease: 'none' });
    });
    return () => ctx.revert();
  }, [active]);

  // Mouse parallax across the whole stack, desktop only.
  useEffect(() => {
    const host = heroRef.current;
    const frames = framesRef.current;
    if (!host || !frames) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const x = gsap.quickTo(frames, 'x', { duration: 0.9, ease: 'power3.out' });
    const y = gsap.quickTo(frames, 'y', { duration: 0.9, ease: 'power3.out' });
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

  if (!slides.length) return null;
  const current = slides[active];

  return (
    <div
      id="top"
      ref={heroRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink"
    >
      <div ref={framesRef} className="absolute inset-0">
        {slides.map((p, i) => (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={i !== active}
          >
            <Image
              src={p.imageUrl}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ filter: 'grayscale(55%) brightness(0.68) contrast(1.05)' }}
            />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{ background: 'linear-gradient(180deg, rgba(93,106,112,0.35), rgba(0,0,0,0.62) 70%)' }}
      />

      {/* Counter, set large the way the reference does — the slide position is
          part of the composition rather than a control tucked in a corner. */}
      <div className="absolute top-0 left-0 z-[3] hidden md:flex items-end gap-1 bg-ink/85 backdrop-blur-sm pl-6 pr-7 pt-[88px] pb-7">
        <span className="font-display font-medium text-[#FFFFFF] text-[44px] leading-none tabular-nums">
          {String(active + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[11px] text-[#FFFFFF]/50 tracking-widest mb-1.5">
          / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* The practice, running up the left edge like a drawing margin. */}
      <span className="absolute left-5 top-1/2 -translate-y-1/2 z-[3] hidden lg:block font-mono text-[10px] tracking-[0.34em] uppercase text-[#FFFFFF]/45 [writing-mode:vertical-rl] rotate-180">
        Planning · Design · CRZ Approvals
      </span>

      <div className="relative z-[2] h-full flex flex-col justify-end px-6 md:px-10 pb-16 text-[#FFFFFF]">
        <div className="max-w-[1240px] mx-auto w-full">
          {/* Fixed: the thesis does not rotate with the work. */}
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent-light mb-6">
            Every structure speaks — we write its process
          </p>

          <div ref={copyRef} key={active}>
            <h1 className="font-display font-medium leading-[1.04] max-w-[18ch] text-[clamp(34px,5.4vw,72px)] uppercase tracking-[0.04em]">
              <span className="block overflow-hidden">
                <span className="hero-line block">{current.title}</span>
              </span>
            </h1>

            <p className="hero-fade mt-5 max-w-[48ch] text-[15px] md:text-base leading-relaxed text-[#AFAEAC]">
              {current.description ??
                'A Mumbai-based studio specialising in planning, design and CRZ approvals.'}
            </p>

            <Link
              href={`/work/${current.slug}`}
              data-cursor-label="View"
              className="hero-fade mt-8 inline-flex items-center gap-3 border border-[#FFFFFF]/45 hover:border-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-ink transition-colors px-7 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase"
            >
              Look more
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth={1.6}>
                <path d="M5 12h13M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous project"
                className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors"
              >
                ← Prev
              </button>
              <span className="h-px w-10 bg-[#FFFFFF]/30" />
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next project"
                className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors"
              >
                Next →
              </button>

              {/* Progress ticks double as direct controls. */}
              <div className="flex gap-2 ml-3">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show ${s.title}`}
                    aria-current={i === active}
                    className={`h-[2px] transition-all duration-500 ${
                      i === active ? 'w-9 bg-[#FFFFFF]' : 'w-4 bg-[#FFFFFF]/35 hover:bg-[#FFFFFF]/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Announced politely for screen readers, which otherwise get no notice
          that the hero changed under them. */}
      <p className="sr-only" aria-live="polite">
        {`Project ${active + 1} of ${slides.length}: ${current.title}`}
      </p>

      <div className="absolute bottom-7 right-6 md:right-10 z-[2] flex items-center gap-2.5 text-[#FFFFFF] font-mono text-[11px] tracking-widest uppercase">
        <span className="relative w-px h-[34px] bg-[#FFFFFF] overflow-hidden">
          <span className="absolute left-0 w-full h-full bg-accent animate-scrollcue" />
        </span>
        Scroll
      </div>
    </div>
  );
}

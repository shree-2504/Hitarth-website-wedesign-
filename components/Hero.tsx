'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = [
  { text: 'Every' },
  { text: 'structure' },
  { text: 'speaks' },
  { text: '—' },
  { text: 'we', em: true },
  { text: 'write', em: true },
  { text: 'its' },
  { text: 'process.' },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !photoRef.current || !tintRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // scroll-linked grayscale-to-colour reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
        },
      });
      tl.fromTo(
        photoRef.current,
        { filter: 'grayscale(100%) brightness(0.62) contrast(1.05)', scale: 1.08 },
        { filter: 'grayscale(0%) brightness(1.04) contrast(1.05)', scale: 1.03, ease: 'none' },
        0
      ).fromTo(tintRef.current, { opacity: 1 }, { opacity: 0.15, ease: 'none' }, 0);

      // on-load word-by-word headline reveal, then subhead + scroll cue
      const words = gsap.utils.toArray<HTMLElement>('.hero-word-inner', headlineRef.current);
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(
          words,
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.045 }
        )
        .fromTo(subRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .fromTo(cueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');

      // subtle mouse-parallax on the photo (desktop only)
      if (isFinePointer && heroRef.current) {
        const moveX = gsap.quickTo(photoRef.current, 'x', { duration: 0.9, ease: 'power3.out' });
        const moveY = gsap.quickTo(photoRef.current, 'y', { duration: 0.9, ease: 'power3.out' });
        const onMove = (e: MouseEvent) => {
          const rect = heroRef.current!.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          moveX(relX * -18);
          moveY(relY * -12);
        };
        const onLeave = () => {
          moveX(0);
          moveY(0);
        };
        heroRef.current.addEventListener('mousemove', onMove);
        heroRef.current.addEventListener('mouseleave', onLeave);
        return () => {
          heroRef.current?.removeEventListener('mousemove', onMove);
          heroRef.current?.removeEventListener('mouseleave', onLeave);
        };
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="top" ref={heroRef} className="relative h-[100svh] min-h-[640px] flex flex-col justify-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          ref={photoRef}
          src="/images/hero-aerial.jpg"
          alt="Aerial view of a residential tower development by We Design Architects"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: 'grayscale(100%) brightness(0.62) contrast(1.05)', transform: 'scale(1.08)' }}
        />
        <div
          ref={tintRef}
          className="absolute inset-0 mix-blend-multiply"
          style={{ background: 'linear-gradient(180deg, rgba(72,37,47,0.35), rgba(16,18,17,0.6) 70%)' }}
        />
      </div>

      <div className="relative z-[2] px-6 md:px-10 pb-16 text-[#F4EDE0]">
        <div className="max-w-[1240px] mx-auto">
          <h1
            ref={headlineRef}
            className="font-display font-medium leading-[1.04] max-w-[16ch] text-[clamp(38px,5.6vw,78px)]"
          >
            {HEADLINE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
                <span
                  className={`hero-word-inner inline-block ${w.em ? 'italic text-accent-light' : ''}`}
                >
                  {w.text}
                </span>
              </span>
            ))}
          </h1>
          <p ref={subRef} className="mt-6 max-w-[46ch] text-base leading-relaxed text-[#D9D2C4]">
            A Mumbai-based studio specialising in planning, design and CRZ approvals — from
            high-end residential towers to sprawling commercial and industrial layouts.
          </p>
        </div>
      </div>

      <div
        ref={cueRef}
        className="absolute bottom-7 right-6 md:right-10 z-[2] flex items-center gap-2.5 text-[#F4EDE0] font-mono text-[11px] tracking-widest uppercase"
      >
        <span className="relative w-px h-[34px] bg-[#F4EDE0] overflow-hidden">
          <span className="absolute left-0 w-full h-full bg-accent animate-scrollcue" />
        </span>
        Scroll
      </div>
    </div>
  );
}

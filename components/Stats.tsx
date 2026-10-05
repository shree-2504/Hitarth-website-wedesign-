'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// `cap` is the short word the figure answers to — the reference sets its
// numbers in badges with a caption above them, which is what turns a row of
// digits into a row of claims.
const STATS = [
  {
    cap: 'Practising since',
    num: '15+',
    lbl: 'Years of expertise in planning & design',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.3}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    cap: 'CRZ cleared',
    num: '1000+',
    lbl: 'Acres of CRZ approvals secured',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.3}>
        <path d="M3 16c4.5-7 13.5-7 18 0" />
        <path d="M3 16h18M7 19.5h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    cap: 'Delivered',
    num: '60+',
    lbl: 'Residential, commercial & industrial projects completed',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.3}>
        <rect x="3.5" y="3.5" width="17" height="17" />
        <path d="M3.5 10h17M10 3.5v17" />
      </svg>
    ),
  },
  {
    cap: 'Team',
    num: 'In-house',
    lbl: 'Experienced team of architects & planners',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.3}>
        <circle cx="9" cy="9" r="3.2" />
        <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
        <path d="M16 7.5a3 3 0 0 1 0 6M17 19c0-2.3-.9-3.9-2.2-4.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Stats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const numEls = gsap.utils.toArray<HTMLElement>('[data-count]', rootRef.current);

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          numEls.forEach((el) => {
            const target = Number(el.dataset.count);
            const suffix = el.dataset.suffix ?? '';
            const counter = { val: 0 };
            gsap.to(counter, {
              val: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(counter.val).toString() + suffix;
              },
            });
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="border-y border-line bg-paper/55">
      {/* Separate cards rather than one row divided by rules: each credential
          is its own claim, and the practice's record is the strongest thing on
          the page after the hero. */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 py-12 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {STATS.map((s) => {
          const match = s.num.match(/^(\d+)(.*)$/);
          return (
            <div
              key={s.num}
              className="reveal group relative border border-line bg-paper-2/20 px-6 py-7 transition-colors duration-500 hover:border-ink/40"
            >
              {/* Caption quiet, figure loud — the reference sets a small grey
                  label over a large coloured numeral, and that order is what
                  makes the number read as the claim. */}
              <div className="flex items-center gap-2.5 text-muted">
                {s.icon}
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase">{s.cap}</span>
              </div>

              <div className="font-display text-[34px] md:text-[38px] font-medium text-accent leading-none mt-5 tabular-nums">
                {match ? (
                  <span data-count={match[1]} data-suffix={match[2]}>
                    0{match[2]}
                  </span>
                ) : (
                  s.num
                )}
              </div>

              <div className="mt-3 text-[13px] text-muted leading-snug">{s.lbl}</div>

              {/* A rule that draws itself in on hover, echoing the eyebrow mark. */}
              <span className="absolute left-6 bottom-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-[calc(100%-3rem)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

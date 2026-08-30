'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { num: '15+', lbl: 'Years of expertise in planning & design' },
  { num: '1000+', lbl: 'Acres of CRZ approvals secured' },
  { num: '60+', lbl: 'Residential, commercial & industrial projects completed' },
  { num: 'In-house', lbl: 'Experienced team of architects & planners' },
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
    <div ref={rootRef} className="border-y border-line bg-paper/90">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => {
          const match = s.num.match(/^(\d+)(.*)$/);
          return (
            <div
              key={s.num}
              className={`reveal py-9 px-0 md:px-7 ${i > 0 ? 'md:border-l border-line' : ''} ${
                i === 2 ? 'md:border-l' : ''
              }`}
            >
              <div className="font-display text-4xl font-medium text-accent leading-none">
                {match ? (
                  <span data-count={match[1]} data-suffix={match[2]}>
                    0{match[2]}
                  </span>
                ) : (
                  s.num
                )}
              </div>
              <div className="mt-2.5 text-[13px] text-muted leading-snug max-w-[20ch]">{s.lbl}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

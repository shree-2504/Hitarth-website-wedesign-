'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mount once near the root. Finds every element with class="reveal" (or
 * "reveal-clip") and animates it in as it enters the viewport. Uses
 * ScrollTrigger.batch so elements that enter together — e.g. a heading and
 * its supporting paragraph — cascade in with a stagger instead of all
 * popping in at once.
 *
 * Re-scans on every route change. This component lives in the persistent site
 * layout, so a client-side navigation swaps the page's DOM without remounting
 * it — and the incoming page's `.reveal` elements would never get registered,
 * leaving them stranded at the opacity:0 the CSS starts them at. A project
 * page reached by clicking showed an empty gap where its gallery should be,
 * while the same URL loaded directly was fine.
 */
export default function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = gsap.utils.toArray<HTMLElement>('.reveal');
    const clipEls = gsap.utils.toArray<HTMLElement>('.reveal-clip');

    if (reduceMotion) {
      els.forEach((el) => el.classList.add('gsap-in'));
      clipEls.forEach((el) => el.classList.add('gsap-in'));
      return;
    }

    const batches: ScrollTrigger[] = [];

    if (els.length) {
      batches.push(
        ...ScrollTrigger.batch(els, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
            }),
        })
      );
    }

    if (clipEls.length) {
      batches.push(
        ...ScrollTrigger.batch(clipEls, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.1,
              ease: 'power4.out',
              stagger: 0.08,
            }),
        })
      );
    }

    // Trigger positions are measured against layout as it exists right now,
    // but pinned sections (e.g. PracticeTabs) and image-driven height changes
    // often settle later — leaving late sections (e.g. Contact) with a stale,
    // already-passed start point that never fires. A fixed delay can't know
    // when that settling is done, so watch total page height directly and
    // refresh whenever it changes.
    let debounce: number;
    const refresh = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    window.addEventListener('load', refresh);

    return () => {
      batches.forEach((t) => t.kill());
      ro.disconnect();
      window.removeEventListener('load', refresh);
      window.clearTimeout(debounce);
    };
  }, [pathname]);

  return null;
}

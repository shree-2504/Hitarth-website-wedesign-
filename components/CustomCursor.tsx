'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HOVER_TARGETS = 'a, button, [data-cursor-hover]';

/**
 * Two-part cursor (dot + trailing ring) that replaces the native pointer on
 * fine-pointer, motion-OK devices. Scales up over links/buttons/images.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reduceMotion) return;
    if (!dotRef.current || !ringRef.current) return;

    document.body.classList.add('custom-cursor-active');

    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    window.addEventListener('mousemove', onMove);

    // mouseover/mouseout fire on every child crossed, not just true enter/exit
    // of the matched target — moving between a button and an icon/span inside
    // it re-fires both, and depending on which one lands last, the dot can be
    // left stuck at scale 0 (invisible) even though the mouse is no longer
    // over anything hoverable. Ignore transitions that stay inside the same
    // target (checked via relatedTarget) so only a real enter/exit animates.
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(HOVER_TARGETS);
      const related = e.relatedTarget as Node | null;
      if (target && !(related && target.contains(related))) {
        gsap.to(ringRef.current, { scale: 1.8, duration: 0.3, ease: 'power3.out' });
        gsap.to(dotRef.current, { scale: 0, duration: 0.3, ease: 'power3.out' });
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(HOVER_TARGETS);
      const related = e.relatedTarget as Node | null;
      if (target && !(related && target.contains(related))) {
        gsap.to(ringRef.current, { scale: 1, duration: 0.3, ease: 'power3.out' });
        gsap.to(dotRef.current, { scale: 1, duration: 0.3, ease: 'power3.out' });
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    // Without this, the dot/ring stay frozen at their last position when the
    // real mouse leaves the browser viewport (e.g. onto the OS taskbar) —
    // looking "stuck" until the pointer re-enters and moves again.
    const onWindowLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        gsap.to([dotRef.current, ringRef.current], { opacity: 0, duration: 0.2 });
      }
    };
    const onWindowEnter = () => {
      gsap.to([dotRef.current, ringRef.current], { opacity: 1, duration: 0.2 });
    };
    document.addEventListener('mouseout', onWindowLeave);
    document.addEventListener('mouseover', onWindowEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseout', onWindowLeave);
      document.removeEventListener('mouseover', onWindowEnter);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

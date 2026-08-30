'use client';

import { useRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import gsap from 'gsap';

type MagneticLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  strength?: number;
};

/**
 * Anchor that pulls slightly toward the cursor on hover (desktop, fine
 * pointers only) and springs back on mouse-leave. Same API as a plain <a>.
 */
export default function MagneticLink({
  children,
  strength = 0.15,
  className,
  ...rest
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  const canAnimate = () =>
    ref.current &&
    !window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ensureQuick = () => {
    if (!ref.current) return;
    if (!quickX.current) {
      quickX.current = gsap.quickTo(ref.current, 'x', { duration: 0.5, ease: 'power3.out' });
    }
    if (!quickY.current) {
      quickY.current = gsap.quickTo(ref.current, 'y', { duration: 0.5, ease: 'power3.out' });
    }
  };

  // Capped in absolute pixels (not just scaled by strength) so wide buttons
  // — e.g. a long phone number — don't drag several pixels further than a
  // short one, and neighbouring buttons never pull far enough to collide.
  const MAX_OFFSET = 10;

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!canAnimate() || !ref.current) return;
    ensureQuick();
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const clamp = (v: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v * strength));
    quickX.current?.(clamp(relX));
    quickY.current?.(clamp(relY));
  };

  const handleLeave = () => {
    if (!canAnimate()) return;
    ensureQuick();
    quickX.current?.(0);
    quickY.current?.(0);
  };

  return (
    <a
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </a>
  );
}

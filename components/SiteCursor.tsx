'use client';

import { useEffect, useRef } from 'react';

const HOVER_TARGETS = 'a, button, select, input, textarea, [role="button"], [data-cursor-hover]';

/**
 * The site pointer: a dot inside a thin ring, plus a mono label that names the
 * action on the elements worth naming.
 *
 * The label is opt-in via `data-cursor-label` rather than generated for every
 * link — a word floating beside the pointer on all thirty nav items and footer
 * links would be noise. Interactive elements without one still get the
 * dot/ring state change.
 *
 * Both parts are pinned to the pointer, with no trailing element. Position is
 * written straight to `style.transform` on each move rather than tweened, and
 * the scale changes live on the children so their transitions never fight that
 * transform.
 */
export default function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label) return;

    // Touch devices have no pointer to replace, and hiding the system cursor
    // from someone who asked for reduced motion would leave them with nothing.
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reduceMotion) return;

    document.body.classList.add('site-cursor-active');

    // Resolving the hover target from the event on every move — rather than
    // tracking mouseover/mouseout pairs — means there is no enter/exit
    // bookkeeping to desync, which is what used to leave the old cursor stuck
    // in its hover state between a button and an icon inside it.
    const onMove = (e: MouseEvent) => {
      root.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const target = e.target as HTMLElement | null;
      const hit = target?.closest?.(HOVER_TARGETS) ?? null;
      root.classList.toggle('is-over', Boolean(hit));

      const word = hit?.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel;
      root.classList.toggle('has-label', Boolean(word));
      if (word && label.textContent !== word) label.textContent = word;
    };

    const onDown = () => root.classList.add('is-down');
    const onUp = () => root.classList.remove('is-down');

    // Without this the cursor freezes at its last position when the real
    // pointer leaves the viewport (onto the OS taskbar, say).
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) root.classList.add('is-out');
    };
    const onEnter = () => root.classList.remove('is-out');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseout', onLeave);
    document.addEventListener('mouseover', onEnter);

    return () => {
      document.body.classList.remove('site-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('mouseover', onEnter);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-cursor is-out" aria-hidden="true">
      <span className="site-cursor-ring" />
      <span className="site-cursor-dot" />
      <span ref={labelRef} className="site-cursor-label" />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import QueryForm from './QueryForm';

export default function EmailStudioModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const lenis = (window as any).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-accent hover:bg-accent-dim transition-colors px-7 py-4 font-mono text-[13px] tracking-wide uppercase inline-flex items-center gap-2.5 text-white"
      >
        Email the studio →
      </button>

      {mounted && open
        ? createPortal(
            // Rendered via portal, not inline: an ancestor further up the tree
            // (any GSAP-revealed .reveal element) can be left with a lingering
            // transform after its animation completes, which turns it into the
            // containing block for position:fixed descendants — trapping this
            // dialog inside that element's small box instead of the viewport.
            // Portaling straight to <body> sidesteps that entirely.
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Email the studio"
              className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-10"
            >
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-ink/90 backdrop-blur-sm cursor-pointer"
              />

              <div className="relative bg-ink border border-[#3A2E22] w-full max-w-[520px] max-h-[88vh] overflow-y-auto p-8 md:p-10 text-left">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-paper/40 text-paper hover:bg-paper hover:text-ink transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
                    <path d="M5 5l14 14M19 5L5 19" />
                  </svg>
                </button>

                <div
                  className="eyebrow justify-start mb-5"
                  style={{ '--eyebrow-color': '#C48F98' } as React.CSSProperties}
                >
                  Email the studio
                </div>
                <h3 className="font-display font-medium text-2xl text-paper mb-6 max-w-[26ch]">
                  Tell us about your project
                </h3>

                <QueryForm />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

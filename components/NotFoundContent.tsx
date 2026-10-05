import Link from 'next/link';

const LINKS = [
  { href: '/work', label: 'View all work' },
  { href: '/interiors', label: 'Interiors' },
  { href: '/#contact', label: 'Start a project' },
];

/**
 * The body of the 404, shared by both not-found boundaries:
 *
 *   app/(site)/not-found.tsx  — notFound() raised inside the site group, e.g.
 *                               a project slug that doesn't exist.
 *   app/not-found.tsx         — any URL that matches no route at all, which
 *                               renders outside the (site) layout and so has
 *                               to bring the chrome with it.
 *
 * Deliberately carries no `reveal` class: those start at opacity 0 and wait on
 * ScrollReveals, which doesn't run on the root boundary. A 404 that animates
 * in is a 404 that can fail to appear.
 */
export default function NotFoundContent() {
  return (
    <section className="bg-paper/40 pt-[140px] md:pt-[168px] pb-24 md:pb-[120px]">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="eyebrow mb-5">Error 404</div>

        <h1 className="font-display font-medium text-[clamp(30px,4.4vw,52px)] max-w-[18ch] leading-[1.08]">
          That page isn&apos;t <em className="not-italic md:italic text-accent">in the set</em>.
        </h1>

        <p className="mt-6 max-w-[54ch] text-[15px] md:text-base leading-relaxed text-[#2F3031]">
          Nothing is drawn at this address. The link may be out of date, or the page may have
          moved since it was shared — the work itself is all still here.
        </p>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[12px] tracking-widest uppercase border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

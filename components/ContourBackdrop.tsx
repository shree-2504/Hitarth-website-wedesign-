// Deterministic contour-ring generator — no Math.random, so server and
// client render identical markup (avoids hydration mismatches). Each ring
// is a closed polygon whose radius is perturbed by a few sine harmonics,
// giving an organic, hand-surveyed wobble instead of a perfect ellipse.
function ringPath(cx: number, cy: number, baseR: number, seed: number, squash = 0.62): string {
  const points = 72;
  const pts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const wobble =
      Math.sin(a * 3 + seed) * 0.1 +
      Math.sin(a * 5 + seed * 1.7) * 0.06 +
      Math.sin(a * 2 + seed * 0.4) * 0.14;
    const r = baseR * (1 + wobble);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * squash;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

type Cluster = {
  cx: number;
  cy: number;
  baseR: number;
  rings: number;
  seed: number;
  squash: number;
  labelElevation: string;
};

const CLUSTERS: Cluster[] = [
  { cx: 260, cy: 620, baseR: 280, rings: 7, seed: 0.4, squash: 0.6, labelElevation: '42M' },
  { cx: 1620, cy: 210, baseR: 230, rings: 6, seed: 2.1, squash: 0.66, labelElevation: '28M' },
  { cx: 1020, cy: 860, baseR: 320, rings: 7, seed: 4.7, squash: 0.58, labelElevation: '55M' },
];

/**
 * Fixed, full-viewport topographic contour lines — an ambient nod to the
 * site-survey drawings a CRZ/planning studio actually produces. Pure SVG +
 * CSS: no WebGL, no scroll-linked JS, so there's nothing to get wrong the
 * way the 3D skyline did — each cluster just drifts and breathes slowly
 * and independently.
 */
export default function ContourBackdrop() {
  return (
    <div className="contour-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {CLUSTERS.map((c, ci) => {
          const step = c.baseR / (c.rings + 1);
          return (
            <g key={ci} className={`contour-cluster contour-cluster-${(ci % 3) + 1}`}>
              {Array.from({ length: c.rings }).map((_, ri) => {
                const r = c.baseR - ri * step;
                const isIndex = ri === Math.floor(c.rings / 2);
                return (
                  <path
                    key={ri}
                    d={ringPath(c.cx, c.cy, r, c.seed + ri * 0.15, c.squash)}
                    className={isIndex ? 'contour-ring contour-ring--index' : 'contour-ring'}
                  />
                );
              })}
              <text x={c.cx + c.baseR * 0.7} y={c.cy} className="contour-label">
                {c.labelElevation}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

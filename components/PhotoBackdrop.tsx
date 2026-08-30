import Image from 'next/image';

// A distinct set from the Work gallery where possible, biased toward wide,
// moody shots that read well tinted and out of focus behind content.
const BACKDROP_IMAGES = [
  '/images/night-aerial.jpg',
  '/images/highrise-park.jpg',
  '/images/coastal-towers.jpg',
  '/images/tower-facade.jpg',
  '/images/tower-cluster.jpg',
];

/**
 * Fixed, full-viewport Ken Burns slideshow using real project photography —
 * slow crossfade + zoom/pan, heavily tinted to the site palette so it reads
 * as ambient texture rather than competing with foreground content.
 */
export default function PhotoBackdrop() {
  return (
    <>
      <div className="photo-backdrop" aria-hidden="true">
        {BACKDROP_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            quality={60}
            priority={i === 0}
            className="photo-backdrop-img"
            style={{ animationDelay: `${-(i * (40 / BACKDROP_IMAGES.length))}s` }}
          />
        ))}
      </div>
      <div className="photo-backdrop-tint" aria-hidden="true" />
    </>
  );
}

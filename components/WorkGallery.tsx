'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Keyboard, A11y, Autoplay, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { Project } from '@/data/projects';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

gsap.registerPlugin(ScrollTrigger);

export default function WorkGallery({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect: (project: Project) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

  // Scoped to this mount (not the page-wide ScrollReveals singleton) so
  // switching filters — which remounts this component — always re-reveals
  // the new slide set instead of leaving them clipped shut.
  useEffect(() => {
    if (!rootRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = gsap.utils.toArray<HTMLElement>('.reveal-clip', rootRef.current);

    if (reduceMotion) {
      els.forEach((el) => el.classList.add('gsap-in'));
      return;
    }

    const triggers = ScrollTrigger.batch(els, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.08,
        }),
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const startAutoplay = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    swiperRef.current?.autoplay?.start();
  };
  const stopAutoplay = () => swiperRef.current?.autoplay?.stop();

  // The coverflow carousel only reads as a carousel when there are enough
  // projects to fill the row. Below that, Swiper's centred loop has to be fed
  // copies to wrap against — which put the two Institutional buildings on
  // screen four times each — and switching the loop off instead parks slide 0
  // in the middle with the left half of the row empty. So small sets are laid
  // out once, side by side, and only full sets get the carousel.
  const CAROUSEL_MIN = 6;

  const card = (p: Project, sizes: string, inCarousel: boolean) => (
    <>
      <button
        type="button"
        onClick={() => onSelect(p)}
        aria-label={`View details for ${p.title}`}
        data-cursor-label="View"
        className="reveal-clip group relative block w-full aspect-[4/5] bg-[#2D2D2D] overflow-hidden text-left"
      >
        <Image
          src={p.imageUrl}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <span className="font-mono text-[11px] text-paper uppercase tracking-widest inline-flex items-center gap-1.5">
            View project <span aria-hidden="true">→</span>
          </span>
        </div>
      </button>
      {/* h3, not h4: this sits under the section's h2 ("Selected work"), so
          an h4 skips a level in the outline. In the carousel, captions ride
          each slide's 3D transform and collided on the tilted side slides, so
          `slide-caption` shows only the centred one's. */}
      <div className={`${inCarousel ? 'slide-caption ' : ''}flex justify-between items-baseline mt-4 gap-4`}>
        <h3 className="font-display font-medium text-[17px]">{p.title}</h3>
        <span className="font-mono text-[11px] text-muted uppercase tracking-wide whitespace-nowrap">
          {p.location}
        </span>
      </div>
    </>
  );

  // Even a full set is short of what Swiper's centred loop needs to wrap
  // cleanly, so it is repeated a whole number of times. A whole multiple
  // spaces each project's copies a full cycle apart, off the visible row.
  const MIN_LOOP_SLIDES = 8;
  const slides = Array.from(
    { length: Math.ceil(MIN_LOOP_SLIDES / Math.max(projects.length, 1)) * projects.length },
    (_, i) => projects[i % projects.length]
  );

  if (projects.length < CAROUSEL_MIN) {
    return (
      <div ref={rootRef} className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6 md:gap-8">
          {projects.map((p) => (
            <div key={p.id} className="w-full sm:w-[calc(50%-12px)] lg:w-auto lg:flex-1 lg:max-w-[340px]">
              {card(p, '(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw', false)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      data-lenis-prevent
      onMouseEnter={startAutoplay}
      onMouseLeave={stopAutoplay}
      className="relative"
    >
      <Swiper
        modules={[EffectCoverflow, Keyboard, A11y, Autoplay, Mousewheel]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        speed={650}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
        slidesPerView="auto"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        onSwiper={(s) => {
          swiperRef.current = s;
          s.autoplay.stop();
        }}
        // Gentle tilt only. At rotate 20 / depth 260 the side slides were bent
        // far enough that the renders stopped being readable — and the renders
        // are the product here.
        coverflowEffect={{
          rotate: 8,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: false,
        }}
        className="!px-6 !pb-4"
      >
        {slides.map((p, i) => (
          <SwiperSlide key={`${p.id}-${i}`} style={{ width: '340px', maxWidth: '78vw' }}>
            <div className="slide-inner">{card(p, '340px', true)}</div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Driven straight off the instance rather than through Swiper's
          Navigation module: that module binds to the buttons at init, when
          these refs were still null, so the arrows rendered but did nothing. */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous project"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center border border-ink/40 bg-paper/70 backdrop-blur-sm hover:border-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-30"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
          <path d="M15 4l-8 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next project"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center border border-ink/40 bg-paper/70 backdrop-blur-sm hover:border-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-30"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
          <path d="M9 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

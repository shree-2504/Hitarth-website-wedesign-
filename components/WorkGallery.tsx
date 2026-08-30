'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Keyboard, A11y, Autoplay, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { Project } from '@/data/projects';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

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
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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

  // Swiper's centered loop mode needs at least slidesPerView + slidesPerGroup + 1
  // real slides to compute the wrap correctly — a category with only 2-3 projects
  // (e.g. Institutional) falls short and leaves a blank gap at the loop boundary.
  // Padding out to a minimum count gives it enough real slides to loop against.
  const MIN_LOOP_SLIDES = 8;
  const loopEnabled = projects.length > 1;
  const slides =
    loopEnabled && projects.length < MIN_LOOP_SLIDES
      ? Array.from({ length: MIN_LOOP_SLIDES }, (_, i) => projects[i % projects.length])
      : projects;

  return (
    <div
      ref={rootRef}
      data-lenis-prevent
      onMouseEnter={startAutoplay}
      onMouseLeave={stopAutoplay}
      className="relative"
    >
      <Swiper
        modules={[EffectCoverflow, Navigation, Keyboard, A11y, Autoplay, Mousewheel]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={loopEnabled}
        speed={650}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
        slidesPerView="auto"
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(s) => {
          const nav = s.params.navigation;
          if (nav && typeof nav === 'object') {
            nav.prevEl = prevRef.current;
            nav.nextEl = nextRef.current;
          }
        }}
        autoplay={{ delay: 1600, disableOnInteraction: false }}
        onSwiper={(s) => {
          swiperRef.current = s;
          s.autoplay.stop();
        }}
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 260,
          modifier: 1,
          slideShadows: false,
        }}
        className="!px-6 !pb-4"
      >
        {slides.map((p, i) => (
          <SwiperSlide key={`${p.id}-${i}`} style={{ width: '340px', maxWidth: '78vw' }}>
            <div className="slide-inner">
              <button
                type="button"
                onClick={() => onSelect(p)}
                aria-label={`View details for ${p.title}`}
                className="reveal-clip group relative block w-full aspect-[4/5] bg-[#1c1c1a] overflow-hidden text-left"
              >
                <Image
                  src={p.imageUrl}
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <span className="font-mono text-[11px] text-paper uppercase tracking-widest inline-flex items-center gap-1.5">
                    View project <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
              <div className="flex justify-between items-baseline mt-4 gap-4">
                <h4 className="font-display font-medium text-[17px]">{p.title}</h4>
                <span className="font-mono text-[11px] text-muted uppercase tracking-wide whitespace-nowrap">
                  {p.location}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={prevRef}
        type="button"
        aria-label="Previous project"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center border border-ink/40 bg-paper/70 backdrop-blur-sm hover:border-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-30"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.5}>
          <path d="M15 4l-8 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        ref={nextRef}
        type="button"
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

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";
import { api } from "../services/api";
import RatingBadge from "./common/RatingBadge";
import { buttonClass } from "./ui/buttonClass";
import { cn } from "./ui/cn";
import { hideBrokenImage } from "./ui/hideBrokenImage";

export interface CarouselItem {
  id: number | string;
  title: string;
  description: string;
  poster: string;
  link: string;
  rating?: number;
  categories?: { id: number; name: string }[];
}

interface HeroCarouselProps {
  items: CarouselItem[];
}

const SLIDE_MS = 7000;
const SWIPE_THRESHOLD = 48;

const HeroCarousel = ({ items }: HeroCarouselProps) => {
  const [rawIndex, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slides = items.slice(0, 5);
  if (slides.length === 0) return null;

  const index = rawIndex % slides.length;
  const go = (delta: number) => setIndex((current) => (current + delta + slides.length) % slides.length);
  const active = slides[index];
  const kind = active.link.startsWith("/series") ? "Series" : "Movie";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured titles"
      className="group/hero relative isolate h-[68svh] min-h-[420px] overflow-hidden bg-ink-950 lg:h-[78svh] lg:max-h-[820px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      {slides.map((item, i) => (
        <div
          key={`${item.id}-${item.link}`}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-1000 ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            onError={hideBrokenImage}
            src={api.getMediaUrl(item.poster)}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className={cn(
              "size-full object-cover object-[center_25%]",
              i === index && "animate-[ken-burns_9s_ease-out_both]",
            )}
          />
        </div>
      ))}

      {/* Readability scrims: bottom fade into the page, left vignette for the copy. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-950/20 to-transparent" />

      <div className="page-x absolute inset-x-0 bottom-0 pb-14 lg:pb-20">
        <div key={index} className="max-w-xl animate-fade-up">
          <div className="mb-3 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.18em] text-white/70 uppercase">
            <span className="h-px w-6 bg-accent" />
            Featured {kind}
          </div>

          <h1 className="font-display text-3xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {active.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/70">
            {active.rating ? <RatingBadge rating={active.rating} size="small" /> : null}
            {active.categories?.slice(0, 3).map((cat, i) => (
              <span key={cat.id} className="flex items-center gap-3">
                {(i > 0 || active.rating) && <span className="size-1 rounded-full bg-white/30" aria-hidden="true" />}
                {cat.name}
              </span>
            ))}
          </div>

          <p className="mt-4 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/65 sm:text-[15px]">
            {active.description}
          </p>

          <div className="mt-7 flex items-center gap-3">
            <Link to={active.link} className={buttonClass("primary", "lg")}>
              <FiPlay className="fill-current" /> Watch now
            </Link>
            <Link to={active.link} className={buttonClass("secondary", "lg", "backdrop-blur-md")}>
              Details
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="page-x absolute right-0 bottom-6 left-0 flex items-center justify-start gap-1.5 lg:bottom-9 lg:justify-end">
            {slides.map((item, i) => (
              <button
                key={`${item.id}-dot`}
                type="button"
                aria-label={`Show ${item.title}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-1 overflow-hidden rounded-full bg-white/20 transition-all duration-500",
                  i === index ? "w-10" : "w-4 hover:bg-white/40",
                )}
              >
                {i === index && (
                  <span
                    // Auto-advance is driven by this bar finishing, so pausing the
                    // animation (hover) also pauses the carousel.
                    onAnimationEnd={() => go(1)}
                    className="absolute inset-0 origin-left rounded-full bg-white"
                    style={{
                      animation: `progress ${SLIDE_MS}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {[-1, 1].map((delta) => (
            <button
              key={delta}
              type="button"
              aria-label={delta < 0 ? "Previous slide" : "Next slide"}
              onClick={() => go(delta)}
              className={cn(
                "absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white opacity-0 ring-1 ring-white/15 backdrop-blur-md transition duration-300 group-hover/hero:opacity-100 hover:bg-black/50 lg:grid",
                delta < 0 ? "left-5" : "right-5",
              )}
            >
              {delta < 0 ? <FiChevronLeft className="size-5" /> : <FiChevronRight className="size-5" />}
            </button>
          ))}
        </>
      )}
    </section>
  );
};

export default HeroCarousel;

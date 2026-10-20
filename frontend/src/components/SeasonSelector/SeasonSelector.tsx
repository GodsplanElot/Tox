import { useLayoutEffect, useRef, useState } from "react";
import type { Season } from "../../types/series";
import { cn } from "../ui/cn";

interface Props {
  seasons: Season[];
  activeSeason: number;
  onSelect: (index: number) => void;
}

/**
 * Segmented season switcher. A single pill glides between seasons instead of
 * each button toggling its own background, so the active state reads as one
 * continuous control.
 */
const SeasonSelector = ({ seasons, activeSeason, onSelect }: Props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const button = buttonRefs.current[activeSeason];
      if (!button) return;
      setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    };
    measure();

    // Center the active season inside the strip without scrolling the page.
    const button = buttonRefs.current[activeSeason];
    const scroller = scrollerRef.current;
    if (button && scroller && scroller.scrollWidth > scroller.clientWidth) {
      const buttonRect = button.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      scroller.scrollTo({
        left:
          scroller.scrollLeft +
          (buttonRect.left - scrollerRect.left) -
          scroller.clientWidth / 2 +
          buttonRect.width / 2,
        behavior: "smooth",
      });
    }

    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [activeSeason, seasons.length]);

  return (
    <div ref={scrollerRef} className="bleed-x -my-1 overflow-x-auto py-1 scrollbar-none sm:mx-0 sm:px-0">
      <div
        ref={trackRef}
        role="tablist"
        aria-label="Seasons"
        className="relative inline-flex min-w-max items-center gap-0.5 rounded-full bg-white/[0.03] p-1 ring-1 ring-white/[0.07] ring-inset"
      >
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 rounded-full bg-white/[0.1] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_4px_14px_-6px_rgb(0_0_0/0.8)] ring-1 ring-white/[0.08] transition-[left,width] duration-300 ease-[var(--ease-out-expo)]"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
        {seasons.map((season, index) => {
          const active = index === activeSeason;
          return (
            <button
              key={season.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(index)}
              className={cn(
                "relative z-10 flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap transition-colors duration-200",
                active ? "text-white" : "text-fg-subtle hover:text-fg-muted",
              )}
            >
              Season {season.season_number}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold tabular-nums transition-colors",
                  active ? "bg-accent text-ink-950" : "bg-white/[0.06] text-fg-subtle",
                )}
              >
                {season.episodes.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonSelector;

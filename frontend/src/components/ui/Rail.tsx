import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "./cn";

type RailProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Horizontally scrolling row that runs edge to edge. Touch users swipe; on
 * pointer devices arrow buttons fade in on hover once there is overflow.
 */
const Rail = ({ children, className }: RailProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrowClass =
    "absolute top-[38%] z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-ink-900/80 text-white opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur-md transition duration-300 group-hover/rail:opacity-100 hover:bg-ink-800 disabled:opacity-0! [@media(hover:hover)]:grid";

  return (
    <div className="group/rail relative">
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className={cn(
          "bleed-x flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 scrollbar-none sm:gap-4 [&>*]:snap-start",
          className,
        )}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Scroll left"
        disabled={edges.start}
        onClick={() => scrollByPage(-1)}
        className={cn(arrowClass, "-left-3 lg:-left-5")}
      >
        <FiChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        disabled={edges.end}
        onClick={() => scrollByPage(1)}
        className={cn(arrowClass, "-right-3 lg:-right-5")}
      >
        <FiChevronRight className="size-5" />
      </button>
    </div>
  );
};

export default Rail;

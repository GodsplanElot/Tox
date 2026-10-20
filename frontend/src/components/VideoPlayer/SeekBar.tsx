import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { formatTime } from "./format";
import { cn } from "../ui/cn";

type SeekBarProps = {
  currentTime: number;
  duration: number;
  bufferedEnd: number;
  onSeek: (time: number) => void;
  onScrubChange?: (scrubbing: boolean) => void;
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

const SeekBar = ({ currentTime, duration, bufferedEnd, onSeek, onScrubChange }: SeekBarProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrubRatio, setScrubRatio] = useState<number | null>(null);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  const ratioFromEvent = (event: PointerEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return clamp((event.clientX - rect.left) / rect.width);
  };

  const hasDuration = duration > 0 && Number.isFinite(duration);
  const played = scrubRatio ?? (hasDuration ? currentTime / duration : 0);
  const buffered = hasDuration ? clamp(bufferedEnd / duration) : 0;
  const preview = scrubRatio ?? hoverRatio;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!hasDuration) return;
    const steps: Record<string, number> = { ArrowLeft: -5, ArrowRight: 5, PageDown: -30, PageUp: 30 };
    if (event.key in steps) {
      event.preventDefault();
      event.stopPropagation();
      onSeek(Math.min(Math.max(currentTime + steps[event.key], 0), duration));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      event.stopPropagation();
      onSeek(event.key === "Home" ? 0 : duration);
    }
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration) || 0}
      aria-valuenow={Math.round(currentTime)}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        if (!hasDuration) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setScrubRatio(ratioFromEvent(event));
        onScrubChange?.(true);
      }}
      onPointerMove={(event) => {
        const ratio = ratioFromEvent(event);
        if (scrubRatio !== null) setScrubRatio(ratio);
        else if (event.pointerType === "mouse") setHoverRatio(ratio);
      }}
      onPointerUp={(event) => {
        if (scrubRatio === null) return;
        onSeek(ratioFromEvent(event) * duration);
        setScrubRatio(null);
        onScrubChange?.(false);
      }}
      onPointerCancel={() => {
        setScrubRatio(null);
        onScrubChange?.(false);
      }}
      onPointerLeave={() => setHoverRatio(null)}
      className="group/seek relative flex h-5 cursor-pointer touch-none items-center outline-none"
    >
      <div
        className={cn(
          "relative h-1 w-full overflow-hidden rounded-full bg-white/20 transition-[height] duration-150 group-hover/seek:h-1.5 group-focus-visible/seek:h-1.5",
          scrubRatio !== null && "h-1.5",
        )}
      >
        <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${buffered * 100}%` }} />
        {hoverRatio !== null && scrubRatio === null && (
          <div className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${hoverRatio * 100}%` }} />
        )}
        <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${played * 100}%` }} />
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgb(245_165_36/0.25)] transition-transform duration-150",
          scrubRatio !== null ? "scale-110" : "scale-0 group-hover/seek:scale-100 group-focus-visible/seek:scale-100",
        )}
        style={{ left: `${played * 100}%` }}
      />

      {preview !== null && hasDuration && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-[11px] font-semibold text-white tabular-nums ring-1 ring-white/10 backdrop-blur-md"
          style={{ left: `clamp(24px, ${preview * 100}%, calc(100% - 24px))` }}
        >
          {formatTime(preview * duration)}
        </div>
      )}
    </div>
  );
};

export default SeekBar;

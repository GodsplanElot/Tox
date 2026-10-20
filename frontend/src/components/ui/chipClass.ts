import { cn } from "./cn";

/** Filter chip: solid white when active, quiet glass otherwise. */
export const chipClass = (active: boolean) =>
  cn(
    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap transition duration-200",
    active
      ? "bg-white text-ink-950 shadow-[0_6px_20px_-8px_rgb(255_255_255/0.5)]"
      : "bg-white/[0.04] text-fg-muted ring-1 ring-white/[0.07] ring-inset hover:bg-white/[0.08] hover:text-white",
  );

import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition duration-200 select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-[1.05em] [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-ink-950 shadow-[0_8px_24px_-10px] shadow-accent/60 hover:bg-accent-strong",
  secondary: "bg-white/[0.08] text-white ring-1 ring-white/10 ring-inset hover:bg-white/[0.13]",
  outline: "text-white ring-1 ring-white/20 ring-inset hover:bg-white/[0.06] hover:ring-white/35",
  ghost: "text-fg-muted hover:bg-white/[0.06] hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "size-10 text-base",
};

/** Class string for button-styled elements (buttons, links, anchors). */
export const buttonClass = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) => cn(base, variants[variant], sizes[size], className);

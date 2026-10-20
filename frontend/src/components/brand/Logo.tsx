import { useId } from "react";
import { cn } from "../ui/cn";

type LogoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * ToxicReels mark: a biohazard trefoil whose hub is a five-window film reel.
 * Drawn inline so it stays crisp at any size; ids are per-instance because
 * the header and footer render it on the same page.
 */
export const LogoMark = ({ className, title }: LogoMarkProps) => {
  const id = useId().replace(/:/g, "");
  const gradient = `${id}-g`;
  const lobesMask = `${id}-lobes`;
  const reelMask = `${id}-reel`;
  const hollow = `${id}-hollow`;
  const lobe = `${id}-lobe`;
  const reelWindow = `${id}-window`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={gradient} x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd166" />
          <stop offset="0.55" stopColor="#f5a524" />
          <stop offset="1" stopColor="#ff6a1f" />
        </linearGradient>
        <mask id={lobesMask}>
          <rect width="64" height="64" fill="#fff" />
          <g fill="#000">
            <circle id={hollow} cx="32" cy="16.4" r="8.6" />
            <use href={`#${hollow}`} transform="rotate(120 32 32)" />
            <use href={`#${hollow}`} transform="rotate(240 32 32)" />
            <circle cx="32" cy="32" r="9.2" />
          </g>
        </mask>
        <mask id={reelMask}>
          <rect width="64" height="64" fill="#fff" />
          <g fill="#000">
            <circle cx="32" cy="32" r="1.3" />
            <circle id={reelWindow} cx="32" cy="28.4" r="1.35" />
            {[72, 144, 216, 288].map((angle) => (
              <use key={angle} href={`#${reelWindow}`} transform={`rotate(${angle} 32 32)`} />
            ))}
          </g>
        </mask>
      </defs>
      <g fill={`url(#${gradient})`}>
        <g mask={`url(#${lobesMask})`}>
          <circle id={lobe} cx="32" cy="20.4" r="11.6" />
          <use href={`#${lobe}`} transform="rotate(120 32 32)" />
          <use href={`#${lobe}`} transform="rotate(240 32 32)" />
        </g>
        <circle cx="32" cy="32" r="6.4" mask={`url(#${reelMask})`} />
      </g>
    </svg>
  );
};

type LogoProps = {
  className?: string;
  /** Hide the wordmark below the `sm` breakpoint. */
  compact?: boolean;
};

/** Mark + wordmark lockup. */
const Logo = ({ className, compact }: LogoProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)}>
    <LogoMark className="size-8" />
    <span
      className={cn(
        "font-display text-[17px] leading-none font-bold tracking-[0.06em] text-white",
        compact && "hidden sm:inline",
      )}
    >
      TOXIC<span className="font-medium text-accent">REELS</span>
    </span>
  </span>
);

export default Logo;

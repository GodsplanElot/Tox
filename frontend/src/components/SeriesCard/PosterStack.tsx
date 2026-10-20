import type { ReactNode } from "react";
import { cn } from "../ui/cn";
import { hideBrokenImage } from "../ui/hideBrokenImage";

type PosterStackProps = {
  src: string;
  alt: string;
  /** Ghost layers behind the poster (0–2), typically one per extra season. */
  sleeves: number;
  size?: "sm" | "lg";
  eager?: boolean;
  className?: string;
  children?: ReactNode;
};

const offsets = {
  sm: { pad: "pt-3", back: "inset-x-[16%] top-0 bottom-6", mid: "inset-x-[8%] top-1.5 bottom-3", radius: "rounded-xl" },
  lg: { pad: "pt-6", back: "inset-x-[14%] top-0 bottom-10", mid: "inset-x-[7%] top-3 bottom-5", radius: "rounded-2xl" },
};

/**
 * Portrait poster with ghost "sleeves" stacked behind it, cut from the same
 * artwork. Sleeves fan out when an ancestor with the `group` class is hovered.
 */
const PosterStack = ({ src, alt, sleeves, size = "sm", eager, className, children }: PosterStackProps) => {
  const o = offsets[size];
  const layers = Math.min(Math.max(sleeves, 0), 2);
  const sleeveClass = cn(
    "absolute bg-cover bg-center ring-1 ring-white/10 saturate-150 transition-transform duration-500 ease-[var(--ease-out-expo)]",
    o.radius,
  );

  return (
    <div className={cn("relative", o.pad, className)}>
      {layers >= 2 && (
        <div
          aria-hidden="true"
          className={cn(sleeveClass, o.back, "opacity-50 brightness-[0.35] group-hover:-translate-y-1.5 group-hover:rotate-[-1.5deg]")}
          style={{ backgroundImage: `url(${src})` }}
        />
      )}
      {layers >= 1 && (
        <div
          aria-hidden="true"
          className={cn(sleeveClass, o.mid, "opacity-80 brightness-50 group-hover:-translate-y-1 group-hover:rotate-[1deg]")}
          style={{ backgroundImage: `url(${src})` }}
        />
      )}

      <div
        className={cn(
          "relative aspect-[2/3] overflow-hidden bg-ink-800 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.95)] ring-1 ring-white/[0.08]",
          "transition duration-500 ease-[var(--ease-out-expo)] group-hover:ring-white/20 group-focus-visible:ring-2 group-focus-visible:ring-accent",
          o.radius,
        )}
      >
        <img
          onError={hideBrokenImage}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className="size-full object-cover transition duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        {children}
      </div>
    </div>
  );
};

export default PosterStack;

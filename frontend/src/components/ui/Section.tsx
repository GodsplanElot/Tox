import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { cn } from "./cn";

type SectionProps = {
  title?: ReactNode;
  kicker?: ReactNode;
  /** Optional trailing text, e.g. an item count. */
  meta?: ReactNode;
  href?: string;
  hrefLabel?: string;
  className?: string;
  children: ReactNode;
};

/** Page section with the standard gutter and an optional heading row. */
const Section = ({ title, kicker, meta, href, hrefLabel = "See all", className, children }: SectionProps) => (
  <section className={cn("page-x mt-10 sm:mt-12", className)}>
    {(title || href) && (
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          {kicker && (
            <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-accent/90 uppercase">{kicker}</p>
          )}
          {title && (
            <h2 className="truncate font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              {title}
              {meta && <span className="ml-2.5 align-middle text-xs font-medium text-fg-subtle">{meta}</span>}
            </h2>
          )}
        </div>
        {href && (
          <Link
            to={href}
            className="group/see inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-fg-muted transition hover:text-white"
          >
            {hrefLabel}
            <FiArrowRight className="size-3.5 transition-transform group-hover/see:translate-x-0.5" />
          </Link>
        )}
      </div>
    )}
    {children}
  </section>
);

export default Section;

import type { ReactNode } from "react";

type PageHeaderProps = {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

/** Title block for listing pages, lit by a faint accent glow. */
const PageHeader = ({ kicker, title, description, children }: PageHeaderProps) => (
  <header className="page-x relative isolate pt-10 pb-2 sm:pt-14">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-48 left-[10%] -z-10 size-[520px] rounded-full bg-accent/[0.07] blur-[110px]"
    />
    <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-accent uppercase">
      <span className="h-px w-6 bg-accent" /> {kicker}
    </p>
    <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-5xl">{title}</h1>
    {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-[15px]">{description}</p>}
    {children && <div className="mt-6">{children}</div>}
  </header>
);

export default PageHeader;

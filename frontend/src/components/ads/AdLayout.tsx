import type { ReactNode } from "react";
import AdSlot from "./AdSlot";

/** Main column with a sticky skyscraper rail on wide screens. */
const AdLayout = ({ children }: { children: ReactNode }) => (
  <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_160px] xl:items-start xl:gap-8">
    <div className="min-w-0">{children}</div>
    <aside aria-label="Sponsored" className="sticky top-24 hidden gap-4 xl:grid">
      <AdSlot unit="160x600" />
      <AdSlot unit="160x300" />
    </aside>
  </div>
);

export default AdLayout;

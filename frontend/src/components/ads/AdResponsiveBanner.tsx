import AdSlot from "./AdSlot";
import { cn } from "../ui/cn";

type AdResponsiveBannerProps = {
  className?: string;
};

/** Leaderboard that swaps to the largest unit that fits the viewport. */
const AdResponsiveBanner = ({ className }: AdResponsiveBannerProps) => {
  return (
    <div className={cn("my-8 w-full", className)} aria-label="Sponsored">
      <div className="hidden lg:block">
        <AdSlot unit="728x90" />
      </div>
      <div className="hidden sm:block lg:hidden">
        <AdSlot unit="468x60" />
      </div>
      <div className="sm:hidden">
        <AdSlot unit="320x50" />
      </div>
    </div>
  );
};

export default AdResponsiveBanner;

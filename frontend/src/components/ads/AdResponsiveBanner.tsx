import AdSlot from "./AdSlot";

type AdResponsiveBannerProps = {
  className?: string;
};

const AdResponsiveBanner = ({ className = "" }: AdResponsiveBannerProps) => {
  return (
    <div className={`ad-responsive-banner ${className}`} aria-label="Sponsored">
      <AdSlot unit="728x90" className="ad-responsive-banner__desktop" />
      <AdSlot unit="468x60" className="ad-responsive-banner__tablet" />
      <AdSlot unit="320x50" className="ad-responsive-banner__mobile" />
    </div>
  );
};

export default AdResponsiveBanner;

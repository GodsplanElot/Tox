import { FaCheckCircle, FaExclamationTriangle, FaRadiation, FaSkull } from "react-icons/fa";
import { cn } from "../ui/cn";

interface RatingBadgeProps {
  rating?: number;
  size?: "small" | "medium" | "large";
}

const SEVERITIES = [
  { min: 9, label: "Hazardous", icon: FaSkull, tone: "text-ember bg-ember/12 ring-ember/25" },
  { min: 7, label: "Toxic", icon: FaRadiation, tone: "text-accent bg-accent/12 ring-accent/25" },
  { min: 5, label: "Caution", icon: FaExclamationTriangle, tone: "text-amber-200 bg-amber-200/10 ring-amber-200/20" },
  { min: 0, label: "Safe", icon: FaCheckCircle, tone: "text-emerald-300 bg-emerald-300/10 ring-emerald-300/20" },
];

const sizes = {
  small: "h-6 gap-1 px-2 text-[11px] [&_svg]:size-2.5",
  medium: "h-7 gap-1.5 px-2.5 text-xs [&_svg]:size-3",
  large: "h-8 gap-2 px-3 text-sm [&_svg]:size-3.5",
};

/** ToxicReels' rating scale: the higher the score, the more "toxic" the title. */
const RatingBadge = ({ rating, size = "medium" }: RatingBadgeProps) => {
  if (!rating) return null;

  const severity = SEVERITIES.find((s) => rating >= s.min) ?? SEVERITIES[SEVERITIES.length - 1];
  const Icon = severity.icon;

  return (
    <span
      title={`${severity.label} · ${rating.toFixed(1)}`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-bold tabular-nums ring-1 backdrop-blur-md ring-inset",
        severity.tone,
        sizes[size],
      )}
    >
      <Icon aria-hidden="true" />
      {rating.toFixed(1)}
      {size !== "small" && (
        <span className="text-[0.82em] font-semibold tracking-wide uppercase opacity-75">{severity.label}</span>
      )}
    </span>
  );
};

export default RatingBadge;

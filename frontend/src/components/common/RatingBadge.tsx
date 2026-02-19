import { FaExclamationTriangle, FaSkull, FaCheckCircle, FaRadiation } from "react-icons/fa";
import "./RatingBadge.css";

interface RatingBadgeProps {
  rating?: number;
  size?: "small" | "medium" | "large";
}

const RatingBadge = ({ rating, size = "medium" }: RatingBadgeProps) => {
  if (!rating) return null;

  let icon;
  let severity: "hazardous" | "toxic" | "caution" | "safe";
  let label: string;

  if (rating >= 9) {
    icon = <FaSkull className="rating-icon" />;
    severity = "hazardous";
    label = "HAZARDOUS";
  } else if (rating >= 7) {
    icon = <FaRadiation className="rating-icon" />;
    severity = "toxic";
    label = "TOXIC";
  } else if (rating >= 5) {
    icon = <FaExclamationTriangle className="rating-icon" />;
    severity = "caution";
    label = "CAUTION";
  } else {
    icon = <FaCheckCircle className="rating-icon" />;
    severity = "safe";
    label = "SAFE";
  }

  return (
    <div className={`rating-badge rating-badge--${severity} rating-badge--${size}`}>
      <div className="rating-badge__icon">{icon}</div>
      <span className="rating-badge__number">{rating.toFixed(1)}</span>
      <span className="rating-badge__label">{label}</span>
    </div>
  );
};

export default RatingBadge;

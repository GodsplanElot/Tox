import { Link } from "react-router-dom";
import type { Series } from "../../types/series";
import RatingBadge from "../common/RatingBadge";
import "./SeriesCard.css";

interface Props {
  series: Series;
}

const SeriesCard = ({ series }: Props) => {
  return (
    <Link to={`/series/${series.id}`} className="series-card">
      <div className="series-card-image">
        <img src={series.poster} alt={series.title} />
        {series.rating && (
          <div className="series-card-rating">
            <RatingBadge rating={series.rating} size="small" />
          </div>
        )}
      </div>
      <div className="series-card-info">
        <h4>{series.title}</h4>
        {series.first_air_date && (
          <span>{new Date(series.first_air_date).getFullYear()}</span>
        )}
      </div>
    </Link>
  );
};

export default SeriesCard;

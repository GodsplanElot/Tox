import { Link } from "react-router-dom";
import { FaPlay, FaLayerGroup } from "react-icons/fa";
import type { Series } from "../../types/series";
import RatingBadge from "../common/RatingBadge";
import { api } from "../../services/api";
import "./SeriesCard.css";

interface Props {
  series: Series;
}

const SeriesCard = ({ series }: Props) => {
  const image = series.hero_image || series.poster;
  const seasonCount = series.seasons?.length ?? 0;

  return (
    <Link to={`/series/${series.slug}`} className="series-card">
      <div className="series-card-thumb">
        <img
          src={api.getMediaUrl(image)}
          alt={series.title}
          loading="lazy"
        />

        <div className="series-card-play" aria-hidden="true">
          <FaPlay />
        </div>

        <div className="series-card-overlay">
          <div className="series-card-chips">
            {seasonCount > 0 && (
              <span className="series-card-season-chip">
                <FaLayerGroup />
                {seasonCount}S
              </span>
            )}
            {series.rating && (
              <RatingBadge rating={series.rating} size="small" />
            )}
          </div>
          <h4 className="series-card-title">{series.title}</h4>
        </div>
      </div>
    </Link>
  );
};

export default SeriesCard;

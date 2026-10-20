import { Link } from "react-router-dom";
import type { Series } from "../../types/series";
import RatingBadge from "../common/RatingBadge";
import { api } from "../../services/api";
import { cn } from "../ui/cn";
import PosterStack from "./PosterStack";

interface Props {
  series: Series;
  className?: string;
}

/** Series poster card; the stacked sleeves behind it hint at its seasons. */
const SeriesCard = ({ series, className }: Props) => {
  const seasonCount = series.seasons?.length ?? series.season_count ?? 0;
  const year = series.first_air_date?.slice(0, 4);
  const genre = series.categories?.[0]?.name;

  return (
    <Link to={`/series/${series.slug}`} className={cn("group block min-w-0 outline-none", className)}>
      <PosterStack src={api.getMediaUrl(series.poster)} alt={series.title} sleeves={seasonCount - 1}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {series.rating ? (
          <div className="absolute top-2 left-2">
            <RatingBadge rating={series.rating} size="small" />
          </div>
        ) : null}
        {seasonCount > 0 && (
          <span className="absolute bottom-2 left-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white/90 uppercase backdrop-blur-md">
            {seasonCount} {seasonCount === 1 ? "Season" : "Seasons"}
          </span>
        )}
      </PosterStack>

      <div className="mt-2.5 min-w-0 px-0.5">
        <h3 className="truncate text-[13.5px] font-semibold text-white/90 transition group-hover:text-white">
          {series.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-fg-subtle">{[year, genre].filter(Boolean).join(" · ") || "Series"}</p>
      </div>
    </Link>
  );
};

export default SeriesCard;

import { Link } from "react-router-dom";
import type { Series } from "../../types/series";
import RatingBadge from "../common/RatingBadge";
import { api } from "../../services/api";
import { cn } from "../ui/cn";

interface Props {
  series: Series;
  className?: string;
}

/**
 * Portrait poster with ghost "sleeves" stacked behind it, one per extra
 * season (up to two), cut from the same artwork. The stack fans out on hover.
 */
const SeriesCard = ({ series, className }: Props) => {
  const poster = api.getMediaUrl(series.poster);
  const seasonCount = series.seasons?.length ?? 0;
  const sleeves = Math.min(Math.max(seasonCount - 1, 0), 2);
  const year = series.first_air_date?.slice(0, 4);
  const genre = series.categories?.[0]?.name;

  return (
    <Link to={`/series/${series.slug}`} className={cn("group block min-w-0 outline-none", className)}>
      <div className="relative pt-3">
        {sleeves >= 2 && (
          <div
            aria-hidden="true"
            className="absolute inset-x-[16%] top-0 bottom-6 rounded-xl bg-cover bg-center opacity-50 ring-1 ring-white/10 brightness-[0.35] saturate-150 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5 group-hover:rotate-[-1.5deg]"
            style={{ backgroundImage: `url(${poster})` }}
          />
        )}
        {sleeves >= 1 && (
          <div
            aria-hidden="true"
            className="absolute inset-x-[8%] top-1.5 bottom-3 rounded-xl bg-cover bg-center opacity-80 ring-1 ring-white/10 brightness-50 saturate-150 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:rotate-[1deg]"
            style={{ backgroundImage: `url(${poster})` }}
          />
        )}

        <div
          className={cn(
            "relative aspect-[2/3] overflow-hidden rounded-xl bg-ink-800 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.08]",
            "transition duration-500 ease-[var(--ease-out-expo)] group-hover:ring-white/20 group-focus-visible:ring-2 group-focus-visible:ring-accent",
          )}
        >
          <img
            src={poster}
            alt={series.title}
            loading="lazy"
            className="size-full object-cover transition duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
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
        </div>
      </div>

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

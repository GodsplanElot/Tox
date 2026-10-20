import React from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import { api } from "../../services/api";
import RatingBadge from "../common/RatingBadge";
import { cn } from "../ui/cn";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  const year = movie.release_date?.slice(0, 4);
  const genre = movie.categories?.[0]?.name;

  return (
    <Link to={`/movies/${movie.slug}`} className={cn("group block min-w-0 outline-none", className)}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-ink-800 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.08] transition duration-500 group-hover:ring-white/20 group-focus-visible:ring-2 group-focus-visible:ring-accent">
        <img
          src={api.getMediaUrl(movie.poster)}
          alt={movie.title}
          loading="lazy"
          className="size-full object-cover transition duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        {movie.rating ? (
          <div className="absolute top-2 left-2">
            <RatingBadge rating={movie.rating} size="small" />
          </div>
        ) : null}
      </div>
      <div className="mt-2.5 min-w-0 px-0.5">
        <h3 className="truncate text-[13.5px] font-semibold text-white/90 transition group-hover:text-white">
          {movie.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-fg-subtle">{[year, genre].filter(Boolean).join(" · ") || "Movie"}</p>
      </div>
    </Link>
  );
};

export default MovieCard;

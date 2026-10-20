import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { api } from "../services/api";
import type { Movie, Series } from "../services/api";
import { hideBrokenImage } from "./ui/hideBrokenImage";

interface SearchSuggestionsProps {
  query: string;
  onClear: () => void;
  isVisible: boolean;
}

type Suggestion = {
  key: string;
  to: string;
  title: string;
  poster: string;
  year?: string;
  rating?: number;
};

const SuggestionGroup = ({
  label,
  items,
  onClear,
}: {
  label: string;
  items: Suggestion[];
  onClear: () => void;
}) => (
  <div className="py-1">
    <p className="px-3 pt-1.5 pb-1 text-[10px] font-bold tracking-[0.14em] text-fg-subtle uppercase">{label}</p>
    {items.map((item) => (
      <Link
        key={item.key}
        to={item.to}
        onClick={onClear}
        className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-white/[0.05]"
      >
        <img
          onError={hideBrokenImage}
          src={api.getMediaUrl(item.poster)}
          alt=""
          loading="lazy"
          className="h-12 w-8 shrink-0 rounded-md bg-ink-700 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">{item.title}</p>
          <p className="text-xs text-fg-subtle">
            {item.year || "—"}
            {item.rating ? ` · ★ ${item.rating.toFixed(1)}` : ""}
          </p>
        </div>
      </Link>
    ))}
  </div>
);

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onClear, isVisible }) => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const hasQuery = query.trim() !== "";
  const shouldLoad = isVisible && hasQuery && movies === null;

  // Load the catalogue once, the first time suggestions are needed.
  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;
    Promise.all([api.getMovies(), api.getSeries()])
      .then(([m, s]) => {
        if (cancelled) return;
        setMovies(m);
        setSeries(s);
      })
      .catch((error) => console.error("Error fetching suggestions:", error));
    return () => {
      cancelled = true;
    };
  }, [shouldLoad]);

  if (!hasQuery || !isVisible || !movies) return null;

  const lowQuery = query.toLowerCase();
  const movieSuggestions: Suggestion[] = movies
    .filter((m) => m.title.toLowerCase().includes(lowQuery))
    .slice(0, 4)
    .map((m) => ({
      key: `m-${m.id}`,
      to: `/movies/${m.slug}`,
      title: m.title,
      poster: m.poster,
      year: m.release_date?.split("-")[0],
      rating: m.rating,
    }));
  const seriesSuggestions: Suggestion[] = series
    .filter((s) => s.title.toLowerCase().includes(lowQuery))
    .slice(0, 4)
    .map((s) => ({
      key: `s-${s.id}`,
      to: `/series/${s.slug}`,
      title: s.title,
      poster: s.poster,
      year: s.first_air_date?.split("-")[0],
      rating: s.rating,
    }));

  if (movieSuggestions.length + seriesSuggestions.length === 0) return null;

  return (
    <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 min-w-72 animate-scale-in overflow-hidden rounded-2xl p-1.5 shadow-2xl shadow-black/60 glass">
      {movieSuggestions.length > 0 && <SuggestionGroup label="Movies" items={movieSuggestions} onClear={onClear} />}
      {seriesSuggestions.length > 0 && <SuggestionGroup label="TV Series" items={seriesSuggestions} onClear={onClear} />}
      <Link
        to={`/search?q=${encodeURIComponent(query)}`}
        onClick={onClear}
        className="mt-1 flex items-center justify-between gap-2 rounded-xl border-t border-white/[0.06] px-3 py-2.5 text-[13px] font-semibold text-accent transition hover:bg-accent/10"
      >
        <span className="truncate">See all results for “{query}”</span>
        <FiArrowRight className="size-4 shrink-0" />
      </Link>
    </div>
  );
};

export default SearchSuggestions;

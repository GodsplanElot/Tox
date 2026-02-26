import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Movie, Series } from "../services/api";

interface SearchSuggestionsProps {
  query: string;
  onClear: () => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onClear,
  isVisible,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    if (!isVisible || !query.trim()) return;

    const fetchData = async () => {
      try {
        const [m, s] = await Promise.all([api.getMovies(), api.getSeries()]);
        setMovies(m);
        setSeries(s);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    fetchData();
  }, [isVisible, query]);

  if (!query.trim() || !isVisible) return null;

  const lowQuery = query.toLowerCase();

  const movieSuggestions = movies
    .filter((m) => m.title.toLowerCase().includes(lowQuery))
    .slice(0, 5);

  const seriesSuggestions = series
    .filter((s) => s.title.toLowerCase().includes(lowQuery))
    .slice(0, 5);

  const totalResults = movieSuggestions.length + seriesSuggestions.length;

  if (totalResults === 0) return null;

  return (
    <div className="search-suggestions-popup">
      {movieSuggestions.length > 0 && (
        <div className="suggestion-section">
          <h6 className="suggestion-header">Movies</h6>
          {movieSuggestions.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.slug}`}
              className="suggestion-item"
              onClick={onClear}
            >
              <img
                src={api.getMediaUrl(movie.poster)}
                alt={movie.title}
                className="suggestion-poster"
              />
              <div className="suggestion-info">
                <span className="suggestion-title">{movie.title}</span>
                <span className="suggestion-meta">
                  {movie.release_date?.split("-")[0] || "N/A"} •{" "}
                  {movie.rating?.toFixed(1)} ★
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {seriesSuggestions.length > 0 && (
        <div className="suggestion-section">
          <h6 className="suggestion-header">TV Series</h6>
          {seriesSuggestions.map((s) => (
            <Link
              key={s.id}
              to={`/series/${s.slug}`}
              className="suggestion-item"
              onClick={onClear}
            >
              <img
                src={api.getMediaUrl(s.poster)}
                alt={s.title}
                className="suggestion-poster"
              />
              <div className="suggestion-info">
                <span className="suggestion-title">{s.title}</span>
                <span className="suggestion-meta">
                  {s.first_air_date?.split("-")[0] || "N/A"} •{" "}
                  {s.rating?.toFixed(1)} ★
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="suggestion-footer">
        <Link to={`/search?q=${encodeURIComponent(query)}`} onClick={onClear}>
          See all results for "{query}"
        </Link>
      </div>
    </div>
  );
};

export default SearchSuggestions;

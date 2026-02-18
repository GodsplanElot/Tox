import React from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import type { Series } from "../types/series";
import { moviesFromDb } from "../data/movies";
import { seriesFromDb } from "../data/series";

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
  if (!query.trim() || !isVisible) return null;

  const lowQuery = query.toLowerCase();

  const movieSuggestions = moviesFromDb
    .filter((m) => m.title.toLowerCase().includes(lowQuery))
    .slice(0, 5);

  const seriesSuggestions = seriesFromDb
    .filter((s) => s.title.toLowerCase().includes(lowQuery))
    .slice(0, 5);

  const totalResults = movieSuggestions.length + seriesSuggestions.length;

  if (totalResults === 0) return null;

  return (
    <div className="search-suggestions-popup">
      {movieSuggestions.length > 0 && (
        <div className="suggestion-section">
          <h6 className="suggestion-header">Movies</h6>
          {movieSuggestions.map((movie: Movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="suggestion-item"
              onClick={onClear}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="suggestion-poster"
              />
              <div className="suggestion-info">
                <span className="suggestion-title">{movie.title}</span>
                <span className="suggestion-meta">
                  {movie.release_date?.split("-")[0] || "N/A"} • {movie.rating}{" "}
                  ★
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {seriesSuggestions.length > 0 && (
        <div className="suggestion-section">
          <h6 className="suggestion-header">TV Series</h6>
          {seriesSuggestions.map((series: Series) => (
            <Link
              key={series.id}
              to={`/series/${series.id}`}
              className="suggestion-item"
              onClick={onClear}
            >
              <img
                src={series.poster}
                alt={series.title}
                className="suggestion-poster"
              />
              <div className="suggestion-info">
                <span className="suggestion-title">{series.title}</span>
                <span className="suggestion-meta">
                  {series.first_air_date?.split("-")[0] || "N/A"} •{" "}
                  {series.rating} ★
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

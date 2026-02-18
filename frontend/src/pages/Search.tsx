import { useSearchParams } from "react-router-dom";
import { useMemo, useState, useRef, useEffect } from "react";

import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import SearchSuggestions from "../components/SearchSuggestions";

import { moviesFromDb } from "../data/movies";
import { seriesFromDb } from "../data/series";

import "../styles/Search.css";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const mobileWrapperRef = useRef<HTMLDivElement>(null);

  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileWrapperRef.current &&
        !mobileWrapperRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * MOVIE RESULTS
   */
  const movieResults = useMemo(() => {
    if (!initialQuery) return [];

    return moviesFromDb.filter((movie) =>
      movie.title.toLowerCase().includes(initialQuery.toLowerCase()),
    );
  }, [initialQuery]);

  /**
   * SERIES RESULTS
   */
  const seriesResults = useMemo(() => {
    if (!initialQuery) return [];

    return seriesFromDb.filter((series) =>
      series.title.toLowerCase().includes(initialQuery.toLowerCase()),
    );
  }, [initialQuery]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q: query });
    setIsSuggestionsVisible(false);
  };

  const recommended = moviesFromDb.slice(0, 12);
  const latest = moviesFromDb.slice(-12);

  return (
    <section className="search-page">
      {/* MOBILE SEARCH INPUT */}
      <form className="search-mobile" onSubmit={onSearch}>
        <div className="search-wrapper" ref={mobileWrapperRef}>
          <i className="bi bi-search search-icon"></i>
          <input
            type="search"
            placeholder="Search movies or TV series..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSuggestionsVisible(true);
            }}
            onFocus={() => setIsSuggestionsVisible(true)}
          />
          <SearchSuggestions
            query={query}
            isVisible={isSuggestionsVisible}
            onClear={() => setIsSuggestionsVisible(false)}
          />
        </div>
      </form>

      {/* SEARCH RESULTS */}
      {initialQuery && (
        <>
          <h2 className="search-title">Results for “{initialQuery}”</h2>

          {/* MOVIES */}
          {movieResults.length > 0 && <MovieGrid movies={movieResults} />}

          {/* SERIES */}
          {seriesResults.length > 0 && (
            <SeriesRail title="TV Series" series={seriesResults} />
          )}

          {/* EMPTY STATE */}
          {movieResults.length === 0 && seriesResults.length === 0 && (
            <p className="no-results">No movies or TV series found.</p>
          )}
        </>
      )}

      {/* RAILS (ALWAYS SHOWN) */}
      <MovieRail title="Recommended" movies={recommended} />
      <MovieRail title="Latest" movies={latest} />
    </section>
  );
};

export default Search;

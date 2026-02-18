import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";

import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";

import { moviesFromDb } from "../data/movies";
import { seriesFromDb } from "../data/series";

import "../styles/Search.css";

const Search = () => {
  const [params, setParams] = useSearchParams();

  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

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
  };

  const recommended = moviesFromDb.slice(0, 12);
  const latest = moviesFromDb.slice(-12);

  return (
    <section className="search-page">
      {/* MOBILE SEARCH INPUT */}
      <form className="search-mobile" onSubmit={onSearch}>
        <div className="search-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="search"
            placeholder="Search movies or TV series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
